import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const VERCEL_ALL_DEPLOYMENTS_TOOL: Tool = {
  name: "vercel-list-all-deployments",
  description: "List deployments under the authenticated user or team.",
  inputSchema: {
    type: "object",
    properties: {
      app: {
        type: "string",
        description: "Name of the deployment",
      },
      limit: {
        type: "number",
        description: "Number of deployments to return",
      },
      projectId: {
        type: "string",
        description: "Filter deployments from the given ID or name",
      },
      state: {
        type: "string",
        description:
          "Filter deployments based on their state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)",
      },
      target: {
        type: "string",
        description: "Filter deployments based on the environment",
      },
    },
  },
};

export const VERCEL_GET_ENVIRONMENTS_TOOL: Tool = {
  name: "vercel-get-environments",
  description: "Retrieve environment variables for a project by ID or name",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description:
          "The project ID or name to retrieve environment variables for",
      },
    },
    required: ["idOrName"],
  },
};

export const VERCEL_TOOLS = [
  VERCEL_ALL_DEPLOYMENTS_TOOL,
  VERCEL_GET_ENVIRONMENTS_TOOL,
] as const;
