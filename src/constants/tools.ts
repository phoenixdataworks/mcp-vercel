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

export const VERCEL_GET_DEPLOYMENT_TOOL: Tool = {
  name: "vercel-get-deployment",
  description: "Get a deployment by its ID or URL",
  inputSchema: {
    type: "object",
    properties: {
      idOrUrl: {
        type: "string",
        description: "ID or URL of the deployment to retrieve",
      },
      teamId: {
        type: "string",
        description: "Team ID to scope the request",
      },
    },
    required: ["idOrUrl"],
  },
};

export const VERCEL_CREATE_DEPLOYMENT_TOOL: Tool = {
  name: "vercel-create-deployment",
  description: "Create a new Vercel deployment",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the deployment/project"
      },
      project: {
        type: "string",
        description: "Project ID or name"
      },
      target: {
        type: "string",
        description: "Deployment target environment (production, preview)",
        enum: ["production", "preview"]
      },
      regions: {
        type: "array",
        items: { type: "string" },
        description: "Regions to deploy to"
      },
      teamId: {
        type: "string",
        description: "Team ID for scoping"
      },
      forceNew: {
        type: "boolean",
        description: "Force new deployment even if identical exists"
      }
    },
    required: ["name", "project"]
  }
};

export const VERCEL_LIST_TEAMS_TOOL: Tool = {
  name: "vercel-list-all-teams",
  description: "List all teams under the authenticated account",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of teams to return"
      },
      since: {
        type: "number",
        description: "Timestamp in milliseconds to get teams created after this time"
      },
      until: {
        type: "number",
        description: "Timestamp in milliseconds to get teams created before this time"
      },
      teamId: {
        type: "string",
        description: "Team ID to scope the request"
      }
    }
  }
};

export const VERCEL_CREATE_PROJECT_TOOL: Tool = {
  name: "vercel-create-project",
  description: "Create a new Vercel project",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the project"
      },
      framework: {
        type: "string",
        description: "Framework preset"
      },
      buildCommand: {
        type: "string",
        description: "Build command"
      },
      devCommand: {
        type: "string",
        description: "Development command"
      },
      installCommand: {
        type: "string",
        description: "Install command"
      },
      outputDirectory: {
        type: "string",
        description: "Output directory"
      },
      publicSource: {
        type: "boolean",
        description: "Make project public"
      },
      rootDirectory: {
        type: "string",
        description: "Root directory"
      },
      serverlessFunctionRegion: {
        type: "string",
        description: "Serverless function region"
      },
      skipGitConnectDuringLink: {
        type: "boolean",
        description: "Skip Git connection"
      },
      teamId: {
        type: "string",
        description: "Team ID for scoping"
      }
    },
    required: ["name"]
  }
};

export const VERCEL_TOOLS = [
  VERCEL_ALL_DEPLOYMENTS_TOOL,
  VERCEL_GET_ENVIRONMENTS_TOOL,
  VERCEL_GET_DEPLOYMENT_TOOL,
  VERCEL_CREATE_DEPLOYMENT_TOOL,
  VERCEL_CREATE_PROJECT_TOOL,
  VERCEL_LIST_TEAMS_TOOL
] as const;
