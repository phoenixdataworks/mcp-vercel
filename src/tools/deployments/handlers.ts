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

/**
 * Creates a new deployment
 * @param params The parameters for creating a deployment
 * @returns Deployment details
 */
/**
 * Create a new Vercel deployment using the v13/deployments API
 * @param params The parameters for creating a deployment
 * @returns The details of the created deployment
 */
export async function handleCreateDeployment(params: any = {}) {
  try {
    // Log the received parameters for debugging (noted in the server logs)
    console.log("Received deployment params:", JSON.stringify(params));

    // Validation and cleaning of parameters
    const validatedParams = CreateDeploymentArgumentsSchema.parse(params);
    console.log("Validated params:", JSON.stringify(validatedParams));

    // Extraction of URL parameters (teamId is a URL parameter, not a body parameter)
    let endpoint = "v13/deployments";
    const queryParams = new URLSearchParams();

    // Handling of the teamId parameter
    if (validatedParams.teamId) {
      queryParams.append("teamId", validatedParams.teamId);
      // Remove teamId from the body request
      delete validatedParams.teamId;
    }

    // Construction of the URL with parameters
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }

    // Preparation of the body request by removing undefined/null values
    const deploymentData: Record<string, any> = {};
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        deploymentData[key] = value;
      }
    });

    // Make the API request
    const data = await vercelFetch<Deployment>(endpoint, {
      method: "POST",
      body: JSON.stringify(deploymentData),
    });

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to create deployment",
            isError: true,
          },
        ],
      };
    }

    // Return successful deployment response
    return {
      content: [
        {
          type: "text",
          text: `Deployment created successfully: ${data.url}`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
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
