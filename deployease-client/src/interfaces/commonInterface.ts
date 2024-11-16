import React from "react";

export interface IAuthProviderProps {
  children?: React.ReactNode;
}
export interface IGlobalLoaderProviderProps {
  children?: React.ReactNode;
}
export interface IToastProviderProps {
  children?: React.ReactNode;
}
export interface IProjectProviderProps {
  children?: React.ReactNode;
}
export interface ISelectedVersion {
  version: string;
  deploymentInitId: string;
}

export interface IProjectCardProps {
  project: IProject;
  handleCreateNewVersion: Function;
}

export interface IAuthContext {
  user: any;
  setUser?: Function;
  fetchUser?: () => void;
}
export interface IGlobalLoaderContext {
  globalLoader: boolean;
  setGlobalLoader: Function;
}
export interface IToastContext {
  showToast: Function;
}
export interface ICreateProjectFormDetails {
  name: string;
  gitURL: string;
}
export interface ICreateProjectFormErrors {
  nameErr: string;
  gitURLErr: string;
}
export interface ITooltipProps {
  children: React.ReactNode;
  tooltipText: string;
}
export interface IProjectContext {
  projects: any;
  setProjects?: Function;
  fetchProjects?: () => void;
  deploymentsObj?: any;
  setDeploymentsObj?: Function;
  logs?: any;
  setLogs?: Function;
  fetchDeployments?: Function;
  fetchDeploymentsByProjectId?: Function;
  createNewProject: Function;
  fetchLogs?: Function;
  logsObj?: any;
  setStartPollingProjDepInitId?: Function;
  startPollingProjDepInitId?: string;
}

export interface Avatar {
  url: string;
  localPath: string;
  _id?: string;
}

export interface User {
  _id?: string;
  avatar: Avatar;
  username: string;
  imageId: string;
  email: string;
  loginType: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IAxiosResponse<T> {
  status: number;
  message?: string;
  success?: boolean;
  data: T;
  projects?: T;
  logs?: T;
}

export interface ISignUpFormState {
  email: string;
  password: string;
  username: string;
  cnfPassword: string;
}
export interface ISignUpErrorFormState {
  emailError: string;
  passwordError: string;
  usernameError: string;
  cnfPasswordError: string;
}

export interface ISignInFormState {
  email: string;
  password: string;
}

export interface ISignInErrorFormState {
  emailError: string;
  passwordError: string;
}

export interface IProject {
  _id: string;
  name: string;
  slug: string;
  gitURL: string;
  user: string;
  deployedURL: string;
  deployments?: [IDeployment];
  lastDeploymentStatus?: string;
  lastDeployedVersion?: string;
  lastDeployedInitId?: string;
  commitHash: string;
  __v?: number;
}

export interface ICreateVersionPayload {
  name: string;
  gitURL: string;
  projectSlug: string;
  deploymentName: string;
  projectId: string;
  commitHash: string;
}

export interface ILog {
  event_id: string;
  deployment_id: string;
  log: string;
}
export interface ILogObj {
  [key: string]: ILog[];
}
export interface IDeployment {
  _id: string;
  deploymentName: string;
  deploymentInitId: string;
  status: string;
  user: string;
  projectId: string;
  __v?: number;
}

export interface IDeploymentObj {
  [key: string]: IDeployment[];
}
