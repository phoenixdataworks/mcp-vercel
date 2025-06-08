#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { VERCEL_TOOLS } from "./constants/tools.js";
import {
  handleAllDeployments,
  handleCreateDeployment,
  handleGetDeployment,
  handleListDeploymentFiles,
} from "./tools/deployments/handlers.js";
import {
  handleCreateProject,
  handleCreateEnvironmentVariables,
  handleListProjects,
} from "./tools/projects/handlers.js";
import { handleGetEnvironments, handleCreateCustomEnvironment } from "./tools/environments/handlers.js";
import { handleListTeams, handleCreateTeam } from "./tools/teams/handlers.js";
import {
  handleGetProjectLogs,
  handleGetDeploymentLogs,
  handleListDeploymentFilesFromLogging,
  handleGetFunctionLogs,
  handleSearchLogs,
  handleGetLogDrains,
  handleCreateLogDrain,
  handleGetRuntimeErrors,
  handleGetBuildErrors,
  handleDebugDeployment,
} from "./tools/logging/handlers.js";
import { handleTestDebug } from "./tools/test-debug.js";

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

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: VERCEL_TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    // Enhanced debug for all requests to see complete request structure
    console.error(`🔧 Tool called: ${name}`);
    console.error(`🔧 Full request.params:`, JSON.stringify(request.params, null, 2));
    console.error(`🔧 Extracted args:`, JSON.stringify(args, null, 2));
    console.error(`🔧 Args type:`, typeof args);
    console.error(`🔧 Args keys:`, Object.keys(args || {}));
    
    // Also check if arguments might be in a different field
    if (request.params.arguments) {
      console.error(`🔧 Found request.params.arguments:`, JSON.stringify(request.params.arguments, null, 2));
    }
    
    switch (name) {
      case "vercel-list-all-deployments":
        return await handleAllDeployments(args);
      case "vercel-get-environments":
        return await handleGetEnvironments(args as any);
      case "vercel-get-deployment":
        return await handleGetDeployment(args);
      case "vercel-list-deployment-files":
        return await handleListDeploymentFilesFromLogging(args);
      case "vercel-create-deployment":
        return await handleCreateDeployment(args);
      case "vercel-create-project":
        return await handleCreateProject(args);
      case "vercel-list-all-teams":
        return await handleListTeams(args);
      case "vercel-create-team":
        return await handleCreateTeam(args);
      case "vercel-create-environment-variables":
        return await handleCreateEnvironmentVariables(args);
      case "vercel-create-custom-environment":
        return await handleCreateCustomEnvironment(args);
      case "vercel-list-projects":
        return await handleListProjects(args);
      // Logging & Debugging Tools
      case "vercel-get-project-logs":
        return await handleGetProjectLogs(args);
      case "vercel-get-deployment-logs":
        return await handleGetDeploymentLogs(args);
      case "vercel-get-function-logs":
        return await handleGetFunctionLogs(args);
      case "vercel-search-logs":
        return await handleSearchLogs(args);
      case "vercel-get-log-drains":
        return await handleGetLogDrains(args);
      case "vercel-create-log-drain":
        return await handleCreateLogDrain(args);
      case "vercel-get-runtime-errors":
        return await handleGetRuntimeErrors(args);
      case "vercel-get-build-errors":
        return await handleGetBuildErrors(args);
      case "vercel-debug-deployment":
        return await handleDebugDeployment(args);
      case "vercel-test-debug":
        return await handleTestDebug(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
});

// Basic HTTP server implementation
async function startHTTPServer(port: number) {
  // Note: This is a basic implementation. For production use, consider using
  // proper MCP HTTP transports like SSEServerTransport with Express
  
  const http = await import('http');
  
  const httpServer = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        name: "Vercel MCP Server",
        version: "0.1.0",
        transport: "HTTP",
        tools: VERCEL_TOOLS.length,
        capabilities: {
          deployments: 4,
          projects: 3,
          environments: 2,
          teams: 2,
          logging: 9
        },
        endpoints: {
          status: "GET /",
          tools: "GET /tools",
          health: "GET /health"
        }
      }, null, 2));
      return;
    }
    
    if (req.method === 'GET' && req.url === '/tools') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        tools: VERCEL_TOOLS.map(tool => ({
          name: tool.name,
          description: tool.description
        }))
      }, null, 2));
      return;
    }
    
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }));
      return;
    }
    
    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: "Not Found",
      message: "Available endpoints: /, /tools, /health"
    }));
  });
  
  return new Promise<() => void>((resolve) => {
    httpServer.listen(port, () => {
      console.error(`🌐 HTTP Server listening on port ${port}`);
      console.error(`📍 Server URL: http://localhost:${port}`);
      console.error(`🔍 Endpoints:`);
      console.error(`   • GET http://localhost:${port}/ - Server info`);
      console.error(`   • GET http://localhost:${port}/tools - List tools`);
      console.error(`   • GET http://localhost:${port}/health - Health check`);
      
      resolve(() => {
        httpServer.close();
      });
    });
  });
}

// Start the server
async function main() {
  const port = process.env.PORT ? parseInt(process.env.PORT) : null;
  const useHttp = process.argv.includes('--http') || port;
  const httpPort = process.argv.includes('--port=3001') ? 3001 : 
                   parseInt(process.argv.find(arg => arg.startsWith('--port='))?.split('=')[1] || '3001') || 
                   port || 3001;
  
  console.error("🚀 Vercel MCP Server starting...");
  console.error(`🔍 Args: ${process.argv.slice(2).join(' ')}`);
  console.error(`📡 HTTP requested: ${useHttp ? 'Yes' : 'No'}`);
  
  if (useHttp) {
    // Start HTTP server
    console.error("🚀 Vercel MCP Server started successfully!");
    console.error(`📡 Transport: HTTP Server on port ${httpPort}`);
    
    const closeServer = await startHTTPServer(httpPort);
    
    // Common logging for both transports
    console.error("");
    console.error("🔧 Tools available:", VERCEL_TOOLS.length);
    console.error("📊 Server capabilities:");
    console.error("   • Deployments: 4 tools");
    console.error("   • Projects: 3 tools");
    console.error("   • Environments: 2 tools");
    console.error("   • Teams: 2 tools");
    console.error("   • Logging & Debugging: 9 tools");
    console.error("");
    console.error("✅ HTTP Server ready - use Ctrl+C to stop");
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.error("\n🛑 Shutting down HTTP server...");
      closeServer();
      process.exit(0);
    });
    
    // Keep alive
    await new Promise(() => {});
    
  } else {
    // Start stdio server
    const transport = new StdioServerTransport();
    
    console.error("🚀 Vercel MCP Server started successfully!");
    console.error("📡 Transport: stdio (stdin/stdout communication)");
    
    await server.connect(transport);
    
    // Common logging for both transports
    console.error("");
    console.error("🔧 Tools available:", VERCEL_TOOLS.length);
    console.error("📊 Server capabilities:");
    console.error("   • Deployments: 4 tools");
    console.error("   • Projects: 3 tools");
    console.error("   • Environments: 2 tools");
    console.error("   • Teams: 2 tools");
    console.error("   • Logging & Debugging: 9 tools");
    console.error("");
    console.error("🌐 Network: No TCP port - using stdio transport");
    console.error("📝 Note: MCP servers typically use stdin/stdout for communication");
    console.error("💡 To run on HTTP port, use: --http --port=3001");
    console.error("");
    console.error("✅ Server ready to accept MCP requests via stdio");
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
