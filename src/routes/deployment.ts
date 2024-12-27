import { Router } from "express";
import { DeploymentController } from "../controllers/deployment";

const router = Router();
const controller = new DeploymentController();

router.post("/", controller.create);
router.get("/project/:projectId", controller.getByProject);
router.get("/:deploymentId", controller.getById);

export default router;
