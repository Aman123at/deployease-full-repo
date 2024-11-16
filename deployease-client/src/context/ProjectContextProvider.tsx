import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IProjectContext,
  IAxiosResponse,
  IProject,
  IProjectProviderProps,
  IDeploymentObj,
  ILogObj,
} from "../interfaces/commonInterface";
import axios from "axios";
import { useGlobalLoaderContext } from "./GlobalLoaderContextProvider";

const ProjectContext = createContext<IProjectContext | null>(null);
export const useProjectContext = () => {
  const state = useContext(ProjectContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

export const ProjectContextProvider: React.FC<IProjectProviderProps> = ({
  children,
}) => {
  const [projects, setProjects] = useState<IProject[] | null>(null);
  const {setGlobalLoader} = useGlobalLoaderContext()
  const [logsObj, setLogsObj] = useState<ILogObj | null>({});
  const [deploymentsObj, setDeploymentsObj] = useState<IDeploymentObj >({});
  const [startPollingProjDepInitId,setStartPollingProjDepInitId] = useState<string>("")
  const [allowedRetry,setAllowedRetry] = useState<number>(20)
  useEffect(()=>{
    if(startPollingProjDepInitId ){
      const interval = setInterval(()=>{
        if(allowedRetry === 0){
          clearInterval(interval)
        }
        const proj:any = projects?.filter((projct) => projct.lastDeployedInitId === startPollingProjDepInitId)
        if(proj && proj.length > 0){
          if(proj[0].lastDeploymentStatus === "active" || proj[0].lastDeploymentStatus === "error"){
            // clear interval
            setStartPollingProjDepInitId("")
            setAllowedRetry(20)
            clearInterval(interval)
          }else{
            // start polling
            if(proj[0]){
              fetchLogs(proj[0].lastDeployedInitId, true);
            }
          }
        }else{
          // clear interval
          setStartPollingProjDepInitId("")
          setAllowedRetry(20)
          clearInterval(interval)
        }

        if(allowedRetry>0){
          setAllowedRetry(allowedRetry-1)
        }
      },10000)
      return ()=>clearInterval(interval);
    }
  },[
    startPollingProjDepInitId
  ])
  const fetchProjects = useCallback(async () => {
    setGlobalLoader(true)
    try {
      const result = await axios.get(
        "http://localhost:9000/api/project/deployments",
        { withCredentials: true }
      );
      if (result && result.status) {
        const resData: IAxiosResponse<IProject[]> = result.data;
        if (resData && resData.projects) {
          setProjects(resData.projects);
        }
      }
      setGlobalLoader(false)
    } catch (error) {
      console.log(error);
      setGlobalLoader(false)
    }
  }, []);
  const fetchLogs = async (deploymentInitId:string,polling:boolean=false)=>{
   
    try {
      const url = polling ? `http://localhost:9000/api/project/logs/${deploymentInitId}?polling=1` : `http://localhost:9000/api/project/logs/${deploymentInitId}`
      const result = await axios.get(url,{withCredentials:true})
      if(result && result.status){
        const resData = result.data;
        if(resData && resData.hasOwnProperty("logs")){
          setLogsObj({...logsObj,[deploymentInitId]:resData.logs})
          if(resData.hasOwnProperty("deployStatus")){
              if(resData.deployStatus === "active"){
                const projectAfterUpdate = projects!.map((project:IProject)=>{
                  if(project.lastDeployedInitId === deploymentInitId){
                    project.lastDeploymentStatus = "active"
                  }
                  return project
                })
                setProjects(projectAfterUpdate)
              }
              if(resData.deployStatus === "in-progress"){
                const projectAfterUpdate = projects!.map((project:IProject)=>{
                  if(project.lastDeployedInitId === deploymentInitId){
                    project.lastDeploymentStatus = "in-progress"
                  }
                  return project
                })
                setProjects(projectAfterUpdate)
              }
              if(resData.deployStatus === "error"){
                const projectAfterUpdate = projects!.map((project:IProject)=>{
                  if(project.lastDeployedInitId === deploymentInitId){
                    project.lastDeploymentStatus = "error"
                  }
                  return project
                })
                setProjects(projectAfterUpdate)
              }
          }
        }

      }
     
    } catch (error) {
      console.log("Unable to fetch logs",error)
  
    }
  }
  const createNewProject = async (data:any)=>{
    setGlobalLoader(true)
    try {
        const result = await axios.post("http://localhost:9000/api/project/create",data,{withCredentials:true})
        if(result && result.data){
            const status = result.data.status
            if(status==="success"){
                console.log("Project Created Successfully")
                fetchProjects()
            }
        }
        setGlobalLoader(false)
    } catch (error) {
        console.log(`Error on creating project : ${error}`)
        setGlobalLoader(false)
    }
  }
  const fetchDeploymentsByProjectId = useCallback(async (projectId: string) => {
    setGlobalLoader(true)
    try {
      const result = await axios.get(
        `http://localhost:9000/api/project/deployments/${projectId}`,
        { withCredentials: true }
      );
      if (
        result &&
        result.hasOwnProperty("data") &&
        result.data.hasOwnProperty("deployments")
      ) {
        // setDeploymentsObj({ projectId, deploymentArr: result.data.deployments });
        setDeploymentsObj({ ...deploymentsObj,[projectId]: result.data.deployments });
      }
      setGlobalLoader(false)
    } catch (error) {
      console.log("Error while fetching deployments", error);
      setGlobalLoader(false)
    }
  }, []);
  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        fetchProjects,
        fetchDeploymentsByProjectId,
        deploymentsObj,
        createNewProject,
        fetchLogs,
        logsObj,
        setStartPollingProjDepInitId,
        startPollingProjDepInitId
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
