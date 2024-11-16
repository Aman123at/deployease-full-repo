import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createProject, deleteProject, fetchDeploymentsByProjectId, fetchProjectWithDeployments, fetchProjectsOfUser, retrieveDeploymentLogs } from "../controllers/project.controllers.js";
const router = Router();

router.post('/create',verifyJWT,createProject)
router.get('/delete/:projectId',verifyJWT,deleteProject)
router.get('/',verifyJWT,fetchProjectsOfUser)
router.get('/logs/:deploymentId',verifyJWT,retrieveDeploymentLogs)
router.get('/deployments',verifyJWT,fetchProjectWithDeployments)
router.get('/deployments/:projectId',verifyJWT,fetchDeploymentsByProjectId)

export default router