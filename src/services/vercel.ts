import { createDeployment, Deployment } from "@vercel/client";
import { DeploymentConfig } from "../types/vercel";

const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

export class VercelService {
  async createDeployment(config: DeploymentConfig) {
    if (!token) throw new Error("VERCEL_TOKEN is required");

    const deployment = await createDeployment({
      token,
      teamId,
      project: config.name,
      projectSettings: {
        framework: null,
      },
      files: config.files,
      env: config.environment,
    });

    return deployment;
  }

  async getProjectDeployments(projectId: string) {
    if (!token) throw new Error("VERCEL_TOKEN is required");

    const response = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.json();
  }

  async getDeployment(deploymentId: string) {
    if (!token) throw new Error("VERCEL_TOKEN is required");

    const response = await fetch(
      `https://api.vercel.com/v6/deployments/${deploymentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.json();
  }
}
