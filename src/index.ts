#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { DeploymentsArgumentsSchema } from "./schema.js";

function getVercelApiToken(): string {
  const vercelApiToken = process.env.VERCEL_API_TOKEN;
  if (!vercelApiToken) {
    console.error("VERCEL_API_TOKEN environment variable is not set");
    process.exit(1);
  }
  return vercelApiToken;
}

const VERCEL_API_TOKEN = getVercelApiToken();

const VERCEL_API = "https://api.vercel.com/";

// Tool definitions
const VERCEL_ALL_DEPLOYMENTS_TOOL: Tool = {
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
          "Filter deployments based on their state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED). Ex: 'BUILDING,READY'",
      },
      target: {
        type: "string",
        description:
          "Filter deployments based on the environment. Ex 'production'",
      },
    },
  },
};

const server = new Server(
  {
    name: "vercel",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
);

const VERCEL_TOOLS = [VERCEL_ALL_DEPLOYMENTS_TOOL] as const;

async function vercelFetch<T>(
  endpoint: any,
  options: any = {},
): Promise<T | null> {
  try {
    const headers = {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    };
    const response = await fetch(`${VERCEL_API}${endpoint}`, {
      //...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Vercel API error:", error);
    return null;
  }
}

interface Deployment {
  uid: string;
  name: string;
  state: string;
  target: string;
  url: string;
  inspectorUrl: string;
  createdAt: number;
  meta: {
    githubCommitAuthorName: string;
    githubCommitMessage: string;
    githubRepoId: string;
    githubRepo: string;
  };
}

interface DeploymentsResponse {
  deployments: Deployment[];
}

// API handlers
async function handleAllDeployments(params: any = {}) {
  try {
    const { app, projectId, state, target, teamId, limit } =
      DeploymentsArgumentsSchema.parse(params);

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
        content: [
          {
            type: "text",
            text: "Failed to retrieve deployments",
          },
        ],
      };
    }

    const deployments = data.deployments || [];
    if (deployments.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No active deployments`,
          },
        ],
      };
    }
    const result = JSON.stringify(deployments, null, 2);
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    console.error("Error in handleAllDeployments:", error);
    return {
      content: [{ type: "text", text: "Error in handleAllDeployments" }],
    };
  }
}

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: VERCEL_TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, args } = request.params;
    switch (name) {
      case VERCEL_ALL_DEPLOYMENTS_TOOL.name:
        const deployments = await handleAllDeployments(args);
        return deployments;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      _meta: {},
      result: {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
            isError: true,
          },
        ],
      },
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Vercel MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
