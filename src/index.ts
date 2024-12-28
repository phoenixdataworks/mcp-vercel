#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { DeploymentsResponse } from "./types";

function getVercelApiToken(): string {
  const vercelApiToken = process.env.VERCEL_API_TOKEN;
  if (!vercelApiToken) {
    console.error("VERCEL_API_TOKEN environment variable is not set");
    process.exit(1);
  }
  return vercelApiToken;
}

const VERCEL_API_TOKEN = getVercelApiToken();

const VERCEL_API = "https://api.vercel.com";

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
    name: "mcp-vercel-resource-manager",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

const VERCEL_TOOLS = [VERCEL_ALL_DEPLOYMENTS_TOOL] as const;

async function vercelFetch(endpoint: any, options: any = {}): Promise<any> {
  const response = await fetch(`${VERCEL_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Vercel API error: ${response.statusText}`);
  }

  return response.json();
}

// API handlers
async function handleAllDeployments(params: any = {}) {
  const { app, limit = 20, projectId, state, target, teamId } = params;

  let url = `/v6/deployments?limit=${limit}`;

  // Ajout des paramètres optionnels à l'URL
  if (app) url += `&app=${app}`;
  if (projectId) url += `&projectId=${projectId}`;
  if (state) url += `&state=${state}`;
  if (target) url += `&target=${target}`;
  if (teamId) url += `&teamId=${teamId}`;

  const response = await vercelFetch(url);

  const data = response["deployments"] as DeploymentsResponse;

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          deployments: data.results.map((deployment) => ({
            name: deployment.name,
            url: deployment.url,
            state: deployment.state,
            target: deployment.target,
            createdAt: deployment.createdAt,
            source: deployment.source,
            inspectorUrl: deployment.inspectorUrl,
            creator: deployment.creator,
            meta: deployment.meta,
            uid: deployment.uid,
          })),
        }),
        isError: false,
      },
    ],
  };
}

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: VERCEL_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case VERCEL_ALL_DEPLOYMENTS_TOOL.name:
        return {
          _meta: {},
          result: await handleAllDeployments(request.params.arguments),
        };
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  console.log("Starting server...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Server started successfully");
}

runServer().catch(console.error);
