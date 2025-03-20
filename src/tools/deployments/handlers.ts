import { vercelFetch } from "../../utils/api.js";
import type { Deployment, DeploymentsResponse } from "./types.js";
import {
  ListDeploymentsArgumentsSchema,
  GetDeploymentArgumentsSchema,
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
