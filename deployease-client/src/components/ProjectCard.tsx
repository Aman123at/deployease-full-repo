import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../context/ProjectContextProvider";
import Tooltip from "./CustomTooltip";
import { isNewCommitDetectedFromGithub } from "../utils/helper";
import { IProject, IProjectCardProps } from "../interfaces/commonInterface";
import { useToastContext } from "../context/ToastContextProvider";



const ProjectCard: React.FC<IProjectCardProps> = ({ project, handleCreateNewVersion }) => {
  const navigate = useNavigate();
  const {showToast} = useToastContext()
  const [updateNowButton, setUpdateNowButton] = useState<boolean>(false);
  const { startPollingProjDepInitId, setStartPollingProjDepInitId } =
    useProjectContext();
  const handleClickRefresh = async (proj: IProject) => {
    const isNewCommit = await isNewCommitDetectedFromGithub(
      proj.gitURL,
      proj.commitHash
    );
    if (isNewCommit) {
      showToast("success","New commit detected, Update now to build new version.")
      setUpdateNowButton(true);
    }else{
      console.log("No new commit detected, Everything is up to date")
      showToast("info","No new commit detected, Everything is up to date")
    }
  };
  useEffect(() => {
    if (
      project.lastDeploymentStatus === "queued" ||
      project.lastDeploymentStatus === "in-progress"
    ) {
      setStartPollingProjDepInitId!(project.lastDeployedInitId);
    }
  }, [project.lastDeploymentStatus]);
  return (
    <div
      key={project._id}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium mb-2">{project.name}</h3>
        {project.lastDeploymentStatus !== "queued" &&
          !startPollingProjDepInitId && (
            <Tooltip tooltipText="Refresh, in case of new commit.">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 cursor-pointer"
                onClick={() => handleClickRefresh(project)}
              >
                <path
                  fill-rule="evenodd"
                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  clip-rule="evenodd"
                />
              </svg>
            </Tooltip>
          )}
      </div>
      <p className="mb-2">
        <span className="font-bold">Status:</span>{" "}
        <span
          className={`px-2 py-1 rounded-full text-white ${
            project.lastDeploymentStatus === "active"
              ? "bg-green-500"
              : project.lastDeploymentStatus === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {project.lastDeploymentStatus}
        </span>
      </p>
      <p className="mb-2">
        <span className="font-bold">Hosted URL:</span>{" "}
        <a
          href={project.deployedURL}
          target="__blank"
          className="text-blue-600 dark:text-blue-400"
        >
          {project.deployedURL}
        </a>
      </p>
      <p className="mb-2">
        <span className="font-bold">GitHub URL:</span>{" "}
        <a
          href={project.gitURL}
          target="__blank"
          className="text-blue-600 dark:text-blue-400"
        >
          {project.gitURL}
        </a>
      </p>
      <p className="mb-2">
        <span className="font-bold">Version:</span>{" "}
        {project.lastDeployedVersion}
      </p>
      <div
        className={`flex ${
          project.lastDeploymentStatus === "queued" ||
          project.lastDeploymentStatus === "in-progress"
            ? "justify-between"
            : "justify-end"
        }`}
      >
        {(project.lastDeploymentStatus === "queued" ||
          project.lastDeploymentStatus === "in-progress") && (
          <div className="flex items-center">
            <div className="spinner w-6 h-6 border-4 border-solid rounded-full animate-spin" />
            <p className="text-sm font-thin dark:text-white ml-2">
              {project.lastDeploymentStatus === "queued"
                ? "Building..."
                : "Almost There..."}
            </p>
          </div>
        )}

        {updateNowButton && (
          <button
            className="bg-blue-500 px-3 mr-3 py-1 rounded-md hover:bg-blue-700"
            onClick={() => {
              setUpdateNowButton(false);
              handleCreateNewVersion(project);
            }}
          >
            Update Now
          </button>
        )}
        <button
          className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-700"
          onClick={() =>
            navigate("/logs", {
              state: {
                projectId: project._id,
                projectName: project.name,
                version: project.lastDeployedVersion,
                deploymentInitId: project.lastDeployedInitId,
                projectLastDeploymentStatus: project.lastDeploymentStatus,
              },
            })
          }
        >
          Check Logs
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
