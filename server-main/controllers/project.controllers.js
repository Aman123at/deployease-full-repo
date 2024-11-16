import { generateSlug } from "random-word-slugs";
import { asyncHandler } from "../utils/asyncHandler.js";
import ContainerService from "../services/Container.service.js";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.models.js";
import { Deployment } from "../models/deployment.models.js";
import { v4 as uuidv4 } from "uuid";
import ClickHouseService from "../services/Clickhouse.service.js";
import { checkBuildStatus } from "../utils/helper.js";
import { BUILD_STATUS } from "../constants.js";
import { exec } from "child_process";
const clickhouseService = new ClickHouseService();

const runContainer = async (ecsClient, command) => {
  if (process.env.MODE === "dev") {
    exec(command, (err, stdout, stderr) => {
      console.log("ERROR >> ", err);
      if (err) {
        throw new ApiError(500, `Running container in DEV mode > err : ${err}`);
      }
      console.log("STDERRR>>", stderr);
      if (stdout) {
        console.log(`Running container in DEV mode > stdout : ${stdout}`);
      }
    });
  } else {
    await ecsClient.send(command);
  }
};
const createProject = asyncHandler(async (req, res) => {
  // extract required fields from request
  const { name, gitURL, projectSlug, deploymentName, projectId, commitHash } =
    req.body;
  const user = req.user;
  // if user have their own slug , use it. Otherwise generate new slug
  const slug = projectSlug ? projectSlug : generateSlug();
  // initiate container service to run task in AWS ECS container
  const containerService = new ContainerService();
  // if this is first deployment of project then name it as 'v1' else take progressive versions
  const deploymentInitId = `${uuidv4()}__${
    deploymentName ? deploymentName : "v1"
  }`;
  const command = containerService.getCommand(
    gitURL,
    slug,
    deploymentInitId,
    process.env.MODE
  );
  const ecsClient = containerService.getECSClient();
  // if slug already present, just run new task using that slug, it will update the same project. Otherwise create new project with new deployment
  if (projectSlug) {
    if (!deploymentName)
      throw new ApiError(402, `Bad Request : Deployment name is required.`);
    try {
      runContainer(ecsClient, command);
      const deployment = await Deployment.create({
        deploymentName,
        status: "queued",
        deploymentInitId,
        userId: req.user._id,
        projectId,
      });
      const project = await Project.findByIdAndUpdate(projectId, {
        commitHash,
      });
      project.save();
      return res.status(200).json({
        status: "success",
        deployment,
      });
    } catch (error) {
      throw new ApiError(500, `Unable to initiate deployment : ${error}`);
    }
  } else {
    try {
      runContainer(ecsClient, command);
      const project = await Project.create({
        name,
        slug,
        user: user._id,
        gitURL,
        deployedURL: `http://${slug}.localhost:8000`,
        commitHash,
      });
      await project.save();
      const deployment = await Deployment.create({
        deploymentName: "v1",
        status: "queued",
        deploymentInitId,
        userId: req.user._id,
        projectId: project._id,
      });
      await deployment.save();
      return res.status(200).json({
        status: "success",
        project,
        deployment,
      });
    } catch (error) {
      throw new ApiError(
        500,
        `Unable to initiate container or unable to create project or unable to create deployment : ${error}`
      );
    }
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, `Project not found with Id : ${projectId}`);
  } else {
    try {
      await Project.findByIdAndDelete(projectId);
      await Deployment.deleteMany({ projectId: { $eq: projectId } });
    } catch (error) {
      throw new ApiError(
        500,
        `Something went wrong while deleting project : ${error}`
      );
    }
  }

  return res.json({
    success: true,
    message: "Project deleted Successfully.",
  });
});

const updateDeploymentStatus = async (
  prevStatus,
  currentStatus,
  prevDeploymentData
) => {
  // check current build started and previous build queued then update status in DB to in-progress
  if (
    currentStatus === BUILD_STATUS.IN_PROGRESS &&
    prevStatus === BUILD_STATUS.QUEUED
  ) {
    await Deployment.updateOne(
      { _id: prevDeploymentData[0]._id },
      { status: BUILD_STATUS.IN_PROGRESS }
    );
  }
  // check current build active and previous build in-progress then update status in DB to active
  if (
    currentStatus === BUILD_STATUS.ACTIVE &&
    (prevStatus === BUILD_STATUS.IN_PROGRESS || BUILD_STATUS.QUEUED)
  ) {
    await Deployment.updateOne(
      { _id: prevDeploymentData[0]._id },
      { status: BUILD_STATUS.ACTIVE }
    );
  }
  // check current build error and previous build in-progress then update status in DB to error
  if (
    currentStatus === BUILD_STATUS.ERROR &&
    prevStatus === BUILD_STATUS.IN_PROGRESS
  ) {
    await Deployment.updateOne(
      { _id: prevDeploymentData[0]._id },
      { status: BUILD_STATUS.ERROR }
    );
  }
};

const retrieveDeploymentLogs = asyncHandler(async (req, res) => {
  const { deploymentId } = req.params;
  const { polling } = req.query;
  try {
    const logs = await clickhouseService.retrieveLogs(deploymentId);
    const deployment = await Deployment.find({
      deploymentInitId: deploymentId,
    });
    const logsData = logs.hasOwnProperty("data") ? logs.data : [];
    const currentStatus = checkBuildStatus(logsData);
    if (deployment && deployment.length) {
      const prevStatus = deployment[0].status;
      // update new deployment status to DB if current and previous status are not equal
      if (currentStatus !== prevStatus) {
        await updateDeploymentStatus(prevStatus, currentStatus, deployment);
      }
    }

    return res.status(200).json(
      polling
        ? { logs: logsData, deployStatus: currentStatus }
        : {
            logs: logsData,
          }
    );
  } catch (error) {
    throw new ApiError(
      500,
      `Unable to fetch logs for given deployment id : ${error}`
    );
  }
});

const fetchDeploymentsByProjectId = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) throw new ApiError(400, "Project Id is required.");
  try {
    const deployments = await Deployment.find({ projectId }).sort({
      deploymentName: -1,
    });
    return res.status(200).json({ deployments });
  } catch (error) {
    throw new ApiError(
      500,
      `Unable to fetch deployments for given project id : ${error}`
    );
  }
});

const fetchProjectsOfUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new ApiError(400, "User Id not present.");
  try {
    const projects = await Project.find({ user: _id });
    return res.status(200).json({ projects });
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while fetching projects : ${error}`
    );
  }
});

const fetchProjectWithDeployments = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) throw new ApiError(400, "User Id not present.");
  try {
    const projects = await Project.aggregate([
      {
        $match: {
          user: _id,
        },
      },
      {
        $lookup: {
          from: "deployments", // The name of the Deployment collection
          localField: "_id",
          foreignField: "projectId",
          as: "deployments",
        },
      },
      { $unwind: "$deployments" },
      {
        $sort: {
          "deployments._id": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          user: { $first: "$user" },
          slug: { $first: "$slug" },
          commitHash: { $first: "$commitHash" },
          gitURL: { $first: "$gitURL" },
          deployedURL: { $first: "$deployedURL" },
          lastDeploymentStatus: { $first: "$deployments.status" },
          lastDeployedVersion: { $first: "$deployments.deploymentName" },
          lastDeployedInitId: { $first: "$deployments.deploymentInitId" },
          __v: { $first: "$__v" },
        },
      },
    ]);

    return res.status(200).json({ projects });
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while fetching projects : ${error}`
    );
  }
});

export {
  createProject,
  retrieveDeploymentLogs,
  fetchDeploymentsByProjectId,
  fetchProjectsOfUser,
  fetchProjectWithDeployments,
  deleteProject,
};
