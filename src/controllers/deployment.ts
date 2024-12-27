import { Request, Response } from "express";
import { VercelService } from "../services/vercel";

const vercelService = new VercelService();

export class DeploymentController {
  async create(req: Request, res: Response) {
    try {
      const deployment = await vercelService.createDeployment(req.body);
      res.json(deployment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getByProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const deployments = await vercelService.getProjectDeployments(projectId);
      res.json(deployments);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { deploymentId } = req.params;
      const deployment = await vercelService.getDeployment(deploymentId);
      res.json(deployment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
