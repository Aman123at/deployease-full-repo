import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import VersionBadge from "../components/VersionBadge";
import { IDeployment, ILog } from "../interfaces/commonInterface";
import { useProjectContext } from "../context/ProjectContextProvider";

const Logs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);
  const [selectedDeploymentInitId, setSelectedDeploymentInitId] = useState<string>("");
  const [logs, setLogs] = useState<ILog[]>([]);
  const { deploymentsObj, fetchDeploymentsByProjectId, logsObj, fetchLogs } = useProjectContext();

  // Redirect to dashboard if state is not present
  useEffect(() => {
    if (!location.state) {
      navigate("/dashboard");
    }
  }, [location.state, navigate]);

  // Extract state properties only if location.state is present
  const {
    projectId,
    projectName,
    version,
    deploymentInitId,
    projectLastDeploymentStatus,
  } = location.state || {};

  // Handle setting notFound if version is not provided
  useEffect(() => {
    if (!version) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
  }, [version]);

  // Handle state initialization from location.state
  useEffect(() => {
    if (version) {
      setSelectedVersion(version);
    }
    if (deploymentInitId) {
      setSelectedDeploymentInitId(deploymentInitId);
    }
  }, [version, deploymentInitId]);

  // Fetch deployments if not already fetched
  useEffect(() => {
    if (projectId && (!deploymentsObj || !deploymentsObj.hasOwnProperty(projectId))) {
      fetchDeploymentsByProjectId?.(projectId);
    }
  }, [projectId, deploymentsObj, fetchDeploymentsByProjectId]);

  // Fetch logs for the selected deployment
  useEffect(() => {
    if (selectedDeploymentInitId && logsObj) {
      if (logsObj.hasOwnProperty(selectedDeploymentInitId)) {
        setLogs(logsObj[selectedDeploymentInitId]);
      } else if (projectLastDeploymentStatus === "active" || projectLastDeploymentStatus === "error") {
        fetchLogs?.(selectedDeploymentInitId);
      }
    }
  }, [selectedDeploymentInitId, logsObj, projectLastDeploymentStatus, fetchLogs]);

  if (!location.state) return null; // Return null early if state is not present

  return notFound ? (
    <p>Log Not Found</p>
  ) : (
    <div className="dark:bg-black">
      <Header isUserLoggedIn />
      <div>
        <h1 className="text-center my-3 text-3xl font-semibold dark:text-white">
          {projectName} : {selectedVersion}
        </h1>
        <div className="flex flex-wrap justify-center items-center mx-15">
          {deploymentsObj &&
            deploymentsObj[projectId]?.length > 0 &&
            deploymentsObj[projectId].map((deployment: IDeployment) => (
              <VersionBadge
                key={deployment.deploymentInitId}
                deploymentName={deployment.deploymentName}
                deploymentInitId={deployment.deploymentInitId}
                selectedVersion={selectedVersion}
                setSelectedVersion={setSelectedVersion}
                setSelectedDeploymentInitId={setSelectedDeploymentInitId}
              />
            ))}
        </div>
        <div className="my-5 flex flex-col justify-center mx-28 overflow-y-scroll h-full">
          <div className="rounded-lg bg-slate-900 w-full border border-white mb-10">
            <div className="flex w-full items-center rounded-t-lg bg-slate-500">
              <svg className="w-6 h-6 mt-3 ml-3" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="6" fill="yellow" />
              </svg>
              <svg className="w-6 h-6 mt-3" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="6" fill="yellow" />
              </svg>
              <svg className="w-6 h-6 mt-3" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="6" fill="yellow" />
              </svg>
              {logs.length === 0 && (
                <div className="ml-auto mr-3 flex items-center">
                  <div className="spinner w-6 h-6 border-4 border-solid rounded-full animate-spin" />
                  <p className="text-white ml-2">Waiting for logs ...</p>
                </div>
              )}
            </div>
            <div className="text-white m-3">
              {logs.map((log: ILog, index: number) => (
                <div key={index}>
                  <span>{log.log}</span>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
