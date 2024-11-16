import { FC, useState } from "react";
import { useProjectContext } from "../context/ProjectContextProvider";
import {
  ICreateProjectFormDetails,
  ICreateProjectFormErrors,
} from "../interfaces/commonInterface";
import { getGitCommitHash, isValidGitHubRepo } from "../utils/helper";

const CreateProjectModal: FC = () => {
  const { createNewProject } = useProjectContext();
  const [projectDetails, setProjectDetails] =
    useState<ICreateProjectFormDetails>({ name: "", gitURL: "" });
  const [errors, setErrors] = useState<ICreateProjectFormErrors>({
    nameErr: "",
    gitURLErr: "",
  });

  const modal: HTMLDialogElement | null = document.getElementById(
    "modal"
  ) as HTMLDialogElement;

  const handleCreateProject = async () => {
    setErrors({ nameErr: "", gitURLErr: "" }); // Clear previous errors

    if (projectDetails.name.length < 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nameErr: "At least 5 characters are required!",
      }));
      return;
    } else if (!projectDetails.gitURL.includes("https://github.com/")) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        gitURLErr: "Please enter a valid GitHub URL!",
      }));
      return;
    } else {
      const repositoryNameValid = await isValidGitHubRepo(
        projectDetails.gitURL
      );
      if (repositoryNameValid) {
          const commitHash = await getGitCommitHash(projectDetails.gitURL)
          if(commitHash){

            await createNewProject({
              name: projectDetails.name,
              gitURL: projectDetails.gitURL,
              commitHash
            });
          }else{
            console.log("Error fetching git commit hash")
          }
       
        modal?.close();
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          gitURLErr:
            "Invalid GitHub repository URL, owner, or repository name not valid!",
        }));
      }
    }
  };

  return (
    <dialog
      id="modal"
      className="p-6 rounded-md shadow-lg m-auto bg-white dark:bg-slate-700 backdrop-blur-5xl w-80"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl dark:text-white">Create New Project</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => modal?.close()}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 dark:text-white cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="space-y-4 mt-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 dark:text-white">
            Name{" "}
          </label>
          <input
            id="name"
            type="text"
            className="mt-1 p-2 w-full border rounded-md dark:bg-gray-500 dark:text-white"
            required
            value={projectDetails.name}
            onChange={(e) =>
              setProjectDetails({ ...projectDetails, name: e.target.value })
            }
          />
          {errors.nameErr && (
            <span className="text-red-500 my-1">{errors.nameErr}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="gitURL"
            className="block text-gray-700 dark:text-white"
          >
            Git URL{" "}
          </label>
          <input
            id="gitURL"
            type="text"
            className="mt-1 p-2 w-full border rounded-md dark:bg-gray-500 dark:text-white"
            required
            value={projectDetails.gitURL}
            onChange={(e) =>
              setProjectDetails({ ...projectDetails, gitURL: e.target.value })
            }
          />
          {errors.gitURLErr && (
            <span className="text-red-500 my-1">{errors.gitURLErr}</span>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            id="closeModal"
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => modal?.close()}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded disabled:cursor-not-allowed"
            disabled={!projectDetails.name || !projectDetails.gitURL}
            onClick={handleCreateProject}
          >
            Submit
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CreateProjectModal;
