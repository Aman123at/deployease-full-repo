// src/DashboardPage.js

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContextProvider";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useProjectContext } from "../context/ProjectContextProvider";
import { ICreateVersionPayload, IProject } from "../interfaces/commonInterface";
import { getGitCommitHash, getNextVersion } from "../utils/helper";
import CreateProjectModal from "../components/CreateProjectModal";

const DashboardPage: React.FC = () => {
  const { user } = useAuthContext();
  const { projects, fetchProjects, createNewProject } = useProjectContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/auth");
    }
  }, [user]);
  useEffect(() => {
    if (projects === null) {
      fetchProjects!();
    }
  }, []);

  const handleCreateNewVersion = async (project: IProject) => {
    const commitHash:string = await getGitCommitHash(project.gitURL)
    const payloadData:ICreateVersionPayload  = {
      name: project.name,
      gitURL: project.gitURL,
      projectSlug: project.slug,
      deploymentName: getNextVersion(project.lastDeployedVersion!),
      projectId: project._id,
      commitHash
    };
    if(commitHash){
      await createNewProject(payloadData);
    }else{
      console.log("Error fetching git commit hash")
    }
  };

  const modal: HTMLDialogElement | null = document.getElementById("modal") as HTMLDialogElement;
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header isUserLoggedIn />
      <main className="container mx-auto p-4">
      <CreateProjectModal />
        {projects && projects.length ? (
          <div>
            <h2 className="text-3xl font-thin mb-4 text-center">
              Your Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((project: IProject, index: number) => (
                <ProjectCard
                  key={index}
                  project={project}
                  handleCreateNewVersion={handleCreateNewVersion}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center  my-5">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              No Projects Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start Creating new projects.
            </p>
            <button
              onClick={() => {console.log("modal",modal);modal.showModal()}}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 transition duration-300"
            >
              + Create New Project
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
