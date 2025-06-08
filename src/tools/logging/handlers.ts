import { vercelFetch } from "../../utils/api.js";
import type { 
  LogsResponse, 
  DeploymentLogsResponse, 
  FunctionLogsResponse, 
  LogDrainsResponse,
  ErrorReportsResponse
} from "./types.js";
import {
  GetProjectLogsArgumentsSchema,
  GetDeploymentLogsArgumentsSchema,
  GetFunctionLogsArgumentsSchema,
  SearchLogsArgumentsSchema,
  GetLogDrainsArgumentsSchema,
  CreateLogDrainArgumentsSchema,
  GetRuntimeErrorsArgumentsSchema,
  GetBuildErrorsArgumentsSchema,
  DebugDeploymentArgumentsSchema,
} from "./schema.js";

/**
 * Get runtime logs for a specific project
 * Uses direct parameter extraction like working deployment tools
 */
export async function handleGetProjectLogs(params: any = {}) {
  try {
    // DEBUG: Log what we actually receive
    console.log("DEBUG handleGetProjectLogs - Raw params:", JSON.stringify(params, null, 2));
    console.log("DEBUG handleGetProjectLogs - Params type:", typeof params);
    console.log("DEBUG handleGetProjectLogs - Params keys:", Object.keys(params || {}));
    
    // Use Zod schema parsing directly on params (like working tools)
    const { projectId, teamId, since, until, limit, level, source, cursor } = 
      GetProjectLogsArgumentsSchema.parse(params);

    // Build URL for Vercel API
    let url = `v1/projects/${encodeURIComponent(projectId)}/logs`;
    const queryParams = new URLSearchParams();
    
    if (teamId) queryParams.append("teamId", teamId);
    if (since) queryParams.append("since", since);
    if (until) queryParams.append("until", until);
    if (limit) queryParams.append("limit", limit.toString());
    if (level) queryParams.append("level", level);
    if (source) queryParams.append("source", source);
    if (cursor) queryParams.append("cursor", cursor);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch<LogsResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve project logs. This feature may require a Pro or Enterprise plan. URL: " + url + " Server Response: " + JSON.stringify(data, null, 2),
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully retrieved logs for project ${projectId}`,
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
          text: `Error retrieving project logs: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Get deployment build logs and events
 * Uses actual Vercel API endpoint with proper parameter extraction
 */
export async function handleGetDeploymentLogs(params: any = {}) {
  try {
    // Use Zod schema parsing directly on params (like working tools)
    const { deploymentId, teamId, follow, since, until, limit, cursor } = 
      GetDeploymentLogsArgumentsSchema.parse(params);

    // Use actual Vercel API endpoint for build logs
    let url = `v3/deployments/${encodeURIComponent(deploymentId)}/events`;
    const queryParams = new URLSearchParams();
    
    if (teamId) queryParams.append("teamId", teamId);
    if (follow) queryParams.append("follow", "1");
    if (since) queryParams.append("since", since);
    if (until) queryParams.append("until", until);
    if (limit) queryParams.append("limit", limit.toString());
    if (cursor) queryParams.append("cursor", cursor);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch<DeploymentLogsResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve deployment logs",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully retrieved deployment logs for ${deploymentId}`,
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
          text: `Error retrieving deployment logs: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Get function logs with proper schema parsing
 */
export async function handleGetFunctionLogs(params: any = {}) {
  try {
    if (!params) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required parameters",
            isError: true,
          },
        ],
      };
    }

    const { functionId, deploymentId, projectId, teamId, since, until, limit, level, cursor } = 
      GetFunctionLogsArgumentsSchema.parse(params);

    let url = `v1/functions/${encodeURIComponent(functionId)}/logs`;
    const queryParams = new URLSearchParams();
    
    if (deploymentId) queryParams.append("deploymentId", deploymentId);
    if (projectId) queryParams.append("projectId", projectId);
    if (teamId) queryParams.append("teamId", teamId);
    if (since) queryParams.append("since", since);
    if (until) queryParams.append("until", until);
    if (limit) queryParams.append("limit", limit.toString());
    if (level) queryParams.append("level", level);
    if (cursor) queryParams.append("cursor", cursor);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch<FunctionLogsResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve function logs",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully retrieved function logs for ${functionId}`,
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
          text: `Error retrieving function logs: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Search logs with full-text search
 */
export async function handleSearchLogs(params: any = {}) {
  try {
    if (!params) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required parameters",
            isError: true,
          },
        ],
      };
    }

    const { projectId, teamId, query, since, until, limit, level, source, cursor } = 
      SearchLogsArgumentsSchema.parse(params);

    let url = `v1/projects/${encodeURIComponent(projectId)}/logs/search`;
    const queryParams = new URLSearchParams();
    
    queryParams.append("q", query);
    if (teamId) queryParams.append("teamId", teamId);
    if (since) queryParams.append("since", since);
    if (until) queryParams.append("until", until);
    if (limit) queryParams.append("limit", limit.toString());
    if (level) queryParams.append("level", level);
    if (source) queryParams.append("source", source);
    if (cursor) queryParams.append("cursor", cursor);
    
    url += `?${queryParams.toString()}`;

    const data = await vercelFetch<LogsResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to search logs",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully searched logs in project ${projectId} for: "${query}"`,
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
          text: `Error searching logs: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Get configured log drains
 */
export async function handleGetLogDrains(params: any = {}) {
  try {
    if (!params) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required parameters",
            isError: true,
          },
        ],
      };
    }

    const { projectId, teamId, limit, cursor } = 
      GetLogDrainsArgumentsSchema.parse(params);

    let url = "v1/log-drains";
    const queryParams = new URLSearchParams();
    
    if (projectId) queryParams.append("projectId", projectId);
    if (teamId) queryParams.append("teamId", teamId);
    if (limit) queryParams.append("limit", limit.toString());
    if (cursor) queryParams.append("cursor", cursor);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch<LogDrainsResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve log drains",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: "Successfully retrieved log drains",
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
          text: `Error retrieving log drains: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Create a new log drain
 */
export async function handleCreateLogDrain(params: any = {}) {
  try {
    if (!params) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required parameters",
            isError: true,
          },
        ],
      };
    }

    const { name, url: drainUrl, projectId, teamId, headers, format, sources } = 
      CreateLogDrainArgumentsSchema.parse(params);

    let endpoint = "v1/log-drains";
    const queryParams = new URLSearchParams();
    
    if (teamId) queryParams.append("teamId", teamId);
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }

    const drainData = {
      name,
      url: drainUrl,
      projectId,
      headers,
      format,
      sources,
    };

    // Remove undefined values
    Object.keys(drainData).forEach(key => {
      if (drainData[key as keyof typeof drainData] === undefined) {
        delete drainData[key as keyof typeof drainData];
      }
    });

    const data = await vercelFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(drainData),
    });

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to create log drain",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully created log drain: ${name}`,
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
          text: `Error creating log drain: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Get runtime error reports
 */
export async function handleGetRuntimeErrors(params: any = {}) {
  try {
    if (!params) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required parameters",
            isError: true,
          },
        ],
      };
    }

    const { projectId, deploymentId, teamId, since, until, limit, status, cursor } = 
      GetRuntimeErrorsArgumentsSchema.parse(params);

    let url = `v1/projects/${encodeURIComponent(projectId)}/errors`;
    const queryParams = new URLSearchParams();
    
    if (deploymentId) queryParams.append("deploymentId", deploymentId);
    if (teamId) queryParams.append("teamId", teamId);
    if (since) queryParams.append("since", since);
    if (until) queryParams.append("until", until);
    if (limit) queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);
    if (cursor) queryParams.append("cursor", cursor);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch<ErrorReportsResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve runtime errors",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully retrieved runtime errors for project ${projectId}`,
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
          text: `Error retrieving runtime errors: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Get build errors for a deployment
 */
export async function handleGetBuildErrors(params: any = {}) {
  try {
    if (!params) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required parameters",
            isError: true,
          },
        ],
      };
    }

    const { deploymentId, teamId, limit } = 
      GetBuildErrorsArgumentsSchema.parse(params);

    let url = `v1/deployments/${encodeURIComponent(deploymentId)}/build-errors`;
    const queryParams = new URLSearchParams();
    
    if (teamId) queryParams.append("teamId", teamId);
    if (limit) queryParams.append("limit", limit.toString());
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve build errors",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully retrieved build errors for deployment ${deploymentId}`,
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
          text: `Error retrieving build errors: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Comprehensive deployment debugging
 */
export async function handleDebugDeployment(params: any = {}) {
  try {
    if (!params) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required parameters",
            isError: true,
          },
        ],
      };
    }

    const { deploymentId, teamId, includeSystemLogs, includeApplicationLogs, includeBuildLogs, since } = 
      DebugDeploymentArgumentsSchema.parse(params);

    const debugData: any = {
      deploymentId,
      timestamp: new Date().toISOString(),
      investigations: []
    };

    // Get deployment details first
    try {
      const deployment = await vercelFetch(`v13/deployments/${encodeURIComponent(deploymentId)}${teamId ? `?teamId=${teamId}` : ''}`);
      debugData.deployment = deployment;
    } catch (err) {
      debugData.investigations.push({
        type: "deployment_details",
        error: `Failed to get deployment details: ${err}`
      });
    }

    // Get build logs if requested
    if (includeBuildLogs) {
      try {
        const buildLogs = await vercelFetch(`v3/deployments/${encodeURIComponent(deploymentId)}/events${teamId ? `?teamId=${teamId}` : ''}`);
        debugData.buildLogs = buildLogs;
      } catch (err) {
        debugData.investigations.push({
          type: "build_logs",
          error: `Failed to get build logs: ${err}`
        });
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `Comprehensive debugging report for deployment ${deploymentId}`,
        },
        {
          type: "text",
          text: JSON.stringify(debugData, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error debugging deployment: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * List deployment files (fixed version)
 */
export async function handleListDeploymentFilesFromLogging(params: any = {}) {
  try {
    // For now, simple parameter extraction since we don't have a schema
    if (!params || !params.arguments) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid request: Missing required arguments",
            isError: true,
          },
        ],
      };
    }

    const { id, teamId, slug } = params.arguments;

    if (!id) {
      return {
        content: [
          {
            type: "text",
            text: "Error: id (deployment ID) is required",
            isError: true,
          },
        ],
      };
    }

    let url = `v6/deployments/${encodeURIComponent(id)}/files`;
    const queryParams = new URLSearchParams();
    
    if (teamId) queryParams.append("teamId", teamId);
    if (slug) queryParams.append("slug", slug);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch(url) as any;

    if (!data || !data.files) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve deployment files or no files found",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Found ${data.files.length} files in deployment ${id}`,
        },
        {
          type: "text",
          text: JSON.stringify(data.files, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error retrieving deployment files: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
} 