import { vercelFetch } from "../../utils/api.js";
import type { Deployment, DeploymentsResponse } from "./types.js";
import {
  ListDeploymentsArgumentsSchema,
  GetDeploymentArgumentsSchema,
  CreateDeploymentArgumentsSchema,
} from "./schema.js";

export async function handleGetDeployment(params: any = {}) {
  try {
    const { idOrUrl, teamId } = GetDeploymentArgumentsSchema.parse(params);

    let url = `v13/deployments/${encodeURIComponent(idOrUrl)}`;
    if (teamId) url += `?teamId=${teamId}`;

    const data = await vercelFetch<Deployment>(url);

    if (!data) {
      return {
        content: [{ type: "text", text: "Failed to retrieve deployment" }],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error}` }],
    };
  }
}

export async function handleCreateDeployment(params: any = {}) {
  try {
    const { name, project, target, regions, teamId, forceNew } =
      CreateDeploymentArgumentsSchema.parse(params);

    const url = `v13/deployments${teamId ? `?teamId=${teamId}` : ""}`;

    const deploymentData = {
      name,
      project,
      target: target || "production",
      ...(regions && { regions }),
      ...(forceNew && { forceNew: 1 }),
    };

    const data = await vercelFetch<Deployment>(url, {
      method: "POST",
      body: JSON.stringify(deploymentData),
    });

    if (!data) {
      return {
        content: [{ type: "text", text: "Failed to create deployment" }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text:
            `Deployment created successfully: ${data.url}\n` +
            JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error creating deployment: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

export async function handleAllDeployments(params: any = {}) {
  try {
    const { app, projectId, state, target, teamId, limit } =
      ListDeploymentsArgumentsSchema.parse(params);

    let url = limit
      ? `v6/deployments?limit=${limit}`
      : "v6/deployments?limit=50";

    if (app) url += `&app=${app}`;
    if (projectId) url += `&projectId=${projectId}`;
    if (state) url += `&state=${state}`;
    if (target) url += `&target=${target}`;
    if (teamId) url += `&teamId=${teamId}`;

    const data = await vercelFetch<DeploymentsResponse>(url);

    if (!data) {
      return {
        content: [{ type: "text", text: "Failed to retrieve deployments" }],
      };
    }

    return {
      content: [
        { type: "text", text: JSON.stringify(data.deployments, null, 2) },
      ],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error}` }],
    };
  }
}
