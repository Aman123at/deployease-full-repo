import React from "react";

const VersionBadge: React.FC<{
  deploymentName: string;
  setSelectedVersion: Function;
  selectedVersion: string;
  deploymentInitId: string;
  setSelectedDeploymentInitId: Function;
}> = ({
  deploymentName,
  selectedVersion,
  setSelectedVersion,
  deploymentInitId,
  setSelectedDeploymentInitId,
}) => {
  return (
    <div
      className={`px-4 m-3 flex items-center py-2 rounded-full  border ${
        selectedVersion === deploymentName &&
        "bg-green-500 text-white dark:bg-green-500 hover:bg-green-500 hover:dark:bg-green-500"
      } cursor-pointer dark:border-white border-gray-300 shadow-md dark:text-white  hover:dark:bg-gray-700 ease-in-out hover:bg-gray-300`}
      onClick={() => {
        setSelectedVersion(deploymentName);
        setSelectedDeploymentInitId(deploymentInitId);
      }}
    >
      Version {deploymentName}
      {selectedVersion === deploymentName && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 ml-2"
        >
          <path
            fill-rule="evenodd"
            d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clip-rule="evenodd"
          />
        </svg>
      )}
    </div>
  );
};

export default VersionBadge;
