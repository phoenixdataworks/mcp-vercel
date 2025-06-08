# Vercel MCP Integration

A Model Context Protocol (MCP) integration for Vercel's REST API, providing programmatic access to Vercel deployment management through AI Assistants like Claude and Cursor.

## 📋 Overview <sub><sup>Last updated: May 2025</sup></sub>

This MCP server implements Vercel's core API endpoints as tools, enabling:

- Deployment monitoring & management
- Environment variable retrieval
- Project deployment status tracking
- Team creation and management
- CI/CD pipeline integration

## ✨ Features

### Current Tools (20 Total)

**📦 Deployments (4 tools)**
- `vercel-list-all-deployments` - List deployments with filtering
- `vercel-get-deployment` - Retrieve specific deployment details
- `vercel-list-deployment-files` - List files in a deployment
- `vercel-create-deployment` - Create new deployments

**🏗️ Projects (3 tools)**
- `vercel-create-project` - Create new Vercel projects
- `vercel-create-environment-variables` - Create multiple environment variables
- `vercel-list-projects` - List all projects with pagination

**🌐 Environments (2 tools)**
- `vercel-get-environments` - Access project environment variables
- `vercel-create-custom-environment` - Create custom environments for projects

**👥 Teams (2 tools)**
- `vercel-list-all-teams` - List all accessible teams
- `vercel-create-team` - Create a new team with custom slug and name

**🔍 Logging & Debugging (9 tools)**
- `vercel-get-project-logs` - Runtime application logs with filtering
- `vercel-get-deployment-logs` - Build and deployment logs
- `vercel-get-function-logs` - Serverless function execution logs
- `vercel-search-logs` - Full-text search across all logs
- `vercel-get-log-drains` - List external log forwarding configurations
- `vercel-create-log-drain` - Create log drains for external systems
- `vercel-get-runtime-errors` - Production error reports and stack traces
- `vercel-get-build-errors` - Build failure analysis and debugging
- `vercel-debug-deployment` - Comprehensive deployment troubleshooting

## 🛣️ Roadmap

- [x] Deployment creation workflow
- [x] Project management tools
- [x] Team management integration (List & Create teams)
- [ ] Real-time deployment monitoring
- [x] Advanced error handling
- [ ] Deployment metrics dashboard

## Tools

### `vercel-list-all-deployments`

List deployments under the authenticated user or team

- **Inputs**:
  - `app` (string): Filter by deployment name
  - `projectId` (string): Filter by project ID/name
  - `state` (string): Filter by state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)
  - `target` (string): Filter by environment (production/preview)
  - `limit` (number): Number of deployments to return
- **Returns**: Array of deployment objects with status, URLs, and metadata

### `vercel-get-deployment`

Get detailed information about a specific deployment

- **Inputs**:
  - `idOrUrl` (string): Deployment ID or URL (required)
  - `teamId` (string): Team ID for request scoping
- **Returns**: Full deployment details including build logs, domains, and environment variables

### `vercel-list-deployment-files`

List all files of a Vercel deployment

- **Inputs**:
  - `id` (string): The unique deployment identifier (required)
  - `teamId` (string): Team identifier to perform the request on behalf of
  - `slug` (string): Team slug to perform the request on behalf of
- **Returns**: Array of file objects with properties like name, type, MIME content type, and file permissions

### `vercel-create-deployment`

Create a new Vercel deployment using the v13/deployments API endpoint

- **Inputs**:
  - **Identification Parameters**:
    - `name` (string): Deployment/project name
    - `project` (string): Project ID/name (required unless deploymentId is provided)
    - `deploymentId` (string): ID of a previous deployment to redeploy (required unless project is provided)
    - `slug` (string): A unique URL-friendly identifier
    - `teamId` (string): Team ID for scoping
    - `customEnvironmentSlugOrId` (string): Custom environment slug or ID
  - **Configuration Parameters**:
    - `target` (string): Environment (production/preview/development, default: production)
    - `regions` (string[]): Deployment regions
    - `functions` (object): Serverless functions configuration
    - `routes` (array): Array of route definitions
    - `cleanUrls` (boolean): Enable or disable Clean URLs
    - `trailingSlash` (boolean): Enable or disable trailing slashes
    - `public` (boolean): Make the deployment public
    - `ignoreCommand` (string): Command to check whether files should be ignored
  - **Source Control Parameters**:
    - `gitSource` (object): Git source information
      - `type` (string): Git provider type (github/gitlab/bitbucket)
      - `repoId` (string/number): Repository ID
      - `ref` (string): Git reference (branch/tag)
      - `sha` (string): Git commit SHA
    - `gitMetadata` (object): Git metadata for the deployment
      - `commitAuthorName` (string): Commit author name
      - `commitMessage` (string): Commit message
      - `commitRef` (string): Git reference
      - `commitSha` (string): Commit SHA
      - `remoteUrl` (string): Git remote URL
      - `dirty` (boolean): If the working directory has uncommitted changes
    - `projectSettings` (object): Project-specific settings
      - `buildCommand` (string): Custom build command
      - `devCommand` (string): Custom development command
      - `framework` (string): Framework preset
      - `installCommand` (string): Custom install command
      - `outputDirectory` (string): Build output directory
      - `rootDirectory` (string): Project root directory
      - `nodeVersion` (string): Node.js version
      - `serverlessFunctionRegion` (string): Region for serverless functions
    - `meta` (object): Additional metadata for the deployment
    - `monorepoManager` (string): Monorepo manager (turborepo, nx, etc.)
  - **File Parameters (for non-git deployments)**:
    - `files` (array): Files to deploy
      - `file` (string): File path
      - `data` (string): File content
      - `encoding` (string): Content encoding (base64/utf-8)
  - **Other Flags**:
    - `forceNew` (boolean): Force new deployment even if identical exists
    - `withCache` (boolean): Enable or disable build cache
    - `autoAssignCustomDomains` (boolean): Automatically assign custom domains
    - `withLatestCommit` (boolean): Include the latest commit in the deployment
- **Returns**: Created deployment details with status URLs, build information, and access links

### `vercel-create-project`

Create a new Vercel project

- **Inputs**:
  - `name` (string): Project name (required)
  - `framework` (string): Framework preset
  - `buildCommand` (string): Custom build command
  - `devCommand` (string): Custom dev command
  - `outputDirectory` (string): Build output directory
  - `teamId` (string): Team ID for scoping
- **Returns**: Project configuration with deployment settings

### `vercel-create-environment-variables`

Create multiple environment variables for a project

- **Inputs**:

  - `projectId` (string): Target project ID (required)
  - `teamId` (string): Team ID for request scoping
  - `environmentVariables` (array): Environment variables to create
    - `key` (string): Variable name (required)
    - `value` (string): Variable value (required)
    - `target` (string[]): Deployment targets (production/preview/development)
    - `type` (string): Variable type (system/encrypted/plain/sensitive)
    - `gitBranch` (string): Optional git branch for variable

- **Returns**: Object with created variables and any skipped entries

### `vercel-create-custom-environment`

Create a custom environment for a Vercel project. Custom environments cannot be named 'Production' or 'Preview'.

- **Inputs**:
  - `idOrName` (string): The unique project identifier or project name (required)
  - `name` (string): Name for the custom environment (required, cannot be 'Production' or 'Preview')
  - `description` (string): Description of the custom environment
  - `branchMatcher` (object): Branch matching configuration
    - `type` (string): Type of branch matching (startsWith/endsWith/contains/exactMatch/regex)
    - `pattern` (string): Pattern to match branches against
  - `teamId` (string): Team ID to perform the request on behalf of
  - `slug` (string): Team slug to perform the request on behalf of
- **Returns**: Created custom environment details including ID, slug, type, description, branch matcher configuration, and domains

### `vercel-list-all-teams`

List all teams accessible to authenticated user

- **Inputs**:
  - `limit` (number): Maximum results to return
  - `since` (number): Timestamp for teams created after
  - `until` (number): Timestamp for teams created before
  - `teamId` (string): Team ID for request scoping
- **Returns**: Paginated list of team objects with metadata

### `vercel-create-team`

Create a new Vercel team

- **Inputs**:
  - `slug` (string): A unique identifier for the team (required)
  - `name` (string): A display name for the team (optional)
- **Returns**: Created team details including ID, slug, and billing information

### `vercel-list-projects`

List all projects under the authenticated user or team

- **Inputs**:
  - `limit` (number): Maximum number of projects to return
  - `from` (number): Timestamp for projects created/updated after this time
  - `teamId` (string): Team ID for request scoping
  - `search` (string): Search projects by name
  - `repoUrl` (string): Filter by repository URL
  - `gitForkProtection` (string): Specify PR authorization from forks (0/1)
- **Returns**: List of project objects with metadata including:
  - `id`: Project ID
  - `name`: Project name
  - `framework`: Associated framework
  - `latestDeployments`: Array of recent deployments
  - `createdAt`: Creation timestamp
  - Additional properties like targets, accountId, etc.

## 🔍 Logging & Debugging Tools

### `vercel-get-project-logs`

Retrieve runtime application logs for a specific project

- **Inputs**:
  - `projectId` (string): Project ID (required)
  - `since` (number): Timestamp to get logs from
  - `until` (number): Timestamp to get logs until
  - `limit` (number): Number of logs to return (1-1000, default: 100)
  - `level` (string): Filter by log level (error/warning/info/debug)
  - `source` (string): Filter by source (runtime/build/function/edge-function)
  - `teamId` (string): Team ID for scoping
- **Returns**: Array of log entries with timestamps, levels, messages, and metadata

### `vercel-get-deployment-logs`

Get build and deployment logs for a specific deployment

- **Inputs**:
  - `deploymentId` (string): Deployment ID (required)
  - `since` (number): Timestamp to get logs from
  - `until` (number): Timestamp to get logs until
  - `limit` (number): Number of logs to return (1-1000, default: 100)
  - `follow` (boolean): Follow logs in real-time
  - `teamId` (string): Team ID for scoping
- **Returns**: Array of build/deployment log entries with detailed build information

### `vercel-get-function-logs`

Retrieve serverless function execution logs with performance metrics

- **Inputs**:
  - `functionId` (string): Function ID (required)
  - `deploymentId` (string): Deployment ID (optional)
  - `since` (number): Timestamp to get logs from
  - `until` (number): Timestamp to get logs until
  - `limit` (number): Number of logs to return (1-1000, default: 100)
  - `teamId` (string): Team ID for scoping
- **Returns**: Function logs with execution time, memory usage, and request/response data

### `vercel-search-logs`

Full-text search across all logs with advanced filtering

- **Inputs**:
  - `query` (string): Search query (required)
  - `projectId` (string): Project ID (optional)
  - `deploymentId` (string): Deployment ID (optional)
  - `since` (number): Timestamp to search from
  - `until` (number): Timestamp to search until
  - `limit` (number): Number of results (1-1000, default: 100)
  - `level` (string): Filter by log level
  - `source` (string): Filter by source
  - `teamId` (string): Team ID for scoping
- **Returns**: Matching log entries with search relevance scoring

### `vercel-get-log-drains`

List configured external log forwarding destinations

- **Inputs**:
  - `projectId` (string): Project ID (optional, lists all if not provided)
  - `teamId` (string): Team ID for scoping
- **Returns**: Array of log drain configurations with destinations and formats

### `vercel-create-log-drain`

Create external log forwarding to services like DataDog, Splunk, etc.

- **Inputs**:
  - `name` (string): Log drain name (required)
  - `projectId` (string): Project ID (required)
  - `url` (string): Destination URL (required)
  - `format` (string): Log format (json/ndjson/syslog, default: json)
  - `headers` (object): Custom HTTP headers for log forwarding
  - `teamId` (string): Team ID for scoping
- **Returns**: Created log drain configuration with webhook details

### `vercel-get-runtime-errors`

Get production error reports and stack traces

- **Inputs**:
  - `projectId` (string): Project ID (required)
  - `deploymentId` (string): Deployment ID (optional)
  - `since` (number): Timestamp to get errors from
  - `until` (number): Timestamp to get errors until
  - `limit` (number): Number of errors (1-100, default: 50)
  - `status` (string): Filter by HTTP status code
  - `teamId` (string): Team ID for scoping
- **Returns**: Array of error reports with stack traces, request context, and frequency

### `vercel-get-build-errors`

Analyze build failures and compilation errors

- **Inputs**:
  - `deploymentId` (string): Deployment ID (required)
  - `projectId` (string): Project ID (optional)
  - `teamId` (string): Team ID for scoping
- **Returns**: Build error details with compilation failures, dependency issues, and suggestions

### `vercel-debug-deployment`

Comprehensive deployment troubleshooting combining logs, errors, and metrics

- **Inputs**:
  - `deploymentId` (string): Deployment ID (required)
  - `includeMetrics` (boolean): Include performance metrics (default: true)
  - `teamId` (string): Team ID for scoping
- **Returns**: Complete debugging report with deployment status, logs, errors, performance data, and recommendations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Vercel API Token
- MCP Client (Claude, Cursor, or other AI Assistants that support MCP)

### Installation

```bash
git clone [your-repo-url]
cd vercel-mcp
npm install
```

### Configuration

1. Create `.env` file:

```env
VERCEL_API_TOKEN=your_api_token_here
```

2. Build and start MCP server:

```bash
npm install
npm run build
npm start
```

## 🔗 Integrating with AI Assistants

### 🎯 Integrating with Cursor (Recommended)

Cursor has built-in MCP support. Follow these steps to integrate the Vercel MCP server:

#### Step 1: Configure MCP Settings

1. Open Cursor Settings (`Ctrl/Cmd + ,`)
2. Search for "MCP" or navigate to `Features → Model Context Protocol`
3. Add the Vercel MCP server configuration

#### Step 2: Add to MCP Configuration JSON

Add this configuration to your MCP settings JSON:

```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": [
        "C:/Users/YourUsername/path/to/mcp-vercel/build/index.js"
      ],
      "env": {
        "VERCEL_API_TOKEN": "your_vercel_token_here"
      }
    }
  }
}
```

**🔧 Configuration Options:**

**Option A: Direct Node Command (Recommended)**
```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": ["C:/path/to/mcp-vercel/build/index.js"],
      "env": {
        "VERCEL_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

**Option B: Using NPM Start**
```json
{
  "mcpServers": {
    "vercel": {
      "command": "npm",
      "args": ["start"],
      "cwd": "C:/path/to/mcp-vercel",
      "env": {
        "VERCEL_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

**Option C: HTTP Transport (Alternative)**
```json
{
  "mcpServers": {
    "vercel-http": {
      "command": "node",
      "args": ["C:/path/to/mcp-vercel/build/index.js", "--http", "--port=3001"],
      "env": {
        "VERCEL_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

#### Step 3: Get Your Vercel API Token

1. Go to [Vercel Dashboard → Settings → Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it (e.g., "MCP Integration") 
4. Set expiration and scope as needed
5. Copy the token and use it in your configuration

#### Step 4: Update File Paths

**Windows Example:**
```json
"args": ["C:/Users/YourUsername/code/mcp-vercel/build/index.js"]
```

**Mac/Linux Example:**
```json
"args": ["/Users/yourusername/code/mcp-vercel/build/index.js"]
```

#### Step 5: Test the Integration

1. Restart Cursor after adding the configuration
2. Open the MCP panel or start a new chat
3. You should see "vercel" listed as an available MCP server
4. Test with a simple command:
   ```
   Please list my recent Vercel deployments
   ```

#### Step 6: Usage Examples

Once connected, you can ask Cursor to:

```
Show me my recent deployments with status details

List all projects in my Vercel account

Get deployment logs for project "my-app"

Search for error logs in the last 24 hours

Create a new deployment for my "blog" project

Debug deployment issues for deployment dpl_abc123

Check runtime errors for my production app
```

### 🌟 Integrating with Claude Desktop

Claude Desktop also supports MCP through configuration:

1. Create/edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

2. Add the Vercel server:

```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": ["/path/to/mcp-vercel/build/index.js"],
      "env": {
        "VERCEL_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

3. Restart Claude Desktop

### 🔧 Troubleshooting

**Common Issues:**

1. **"Server not found" error:**
   - Check that the file path is correct and absolute
   - Ensure Node.js is installed and accessible
   - Verify the build directory exists (`npm run build`)

2. **"Authentication error":**
   - Verify your VERCEL_API_TOKEN is correct
   - Check token hasn't expired
   - Ensure token has necessary permissions

3. **"Connection failed":**
   - Make sure no other process is using the same port (for HTTP mode)
   - Check that all dependencies are installed (`npm install`)
   - Try removing and re-adding the MCP server configuration

4. **Tools not appearing:**
   - Restart your IDE/editor after configuration changes
   - Check the MCP server logs for any startup errors
   - Verify the configuration JSON syntax is valid

### Programmatic Integration

You can also use the Model Context Protocol SDK to integrate with the server programmatically in your own applications:

```javascript
import { Client } from "@modelcontextprotocol/sdk/client";

// Create an MCP client connected to a stdio transport
const client = new Client({
  transport: "stdio",
  cmd: "npm --prefix /path/to/vercel-mcp start",
});

// Or connect to an HTTP transport
const httpClient = new Client({
  transport: "http",
  url: "http://localhost:3399",
});

// Connect to the server
await client.connect();

// List available tools
const { tools } = await client.listTools();
console.log(
  "Available tools:",
  tools.map((t) => t.name)
);

// Call a tool
const result = await client.callTool({
  name: "vercel-list-all-deployments",
  args: { limit: 5 },
});

console.log("Deployments:", result);

// You can also use this in an Express server:
app.post("/api/deployments", async (req, res) => {
  try {
    const result = await client.callTool({
      name: "vercel-list-all-deployments",
      args: req.body,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🛠️ Tool Usage Examples

### List Deployments

```javascript
const response = await mcpClient.callTool({
  name: "vercel-list-all-deployments",
  args: {
    limit: 5,
    target: "production",
  },
});
```

### Get Specific Deployment

```javascript
const deployment = await mcpClient.callTool({
  name: "vercel-get-deployment",
  args: {
    idOrUrl: "dpl_5WJWYSyB7BpgTj3EuwF37WMRBXBtPQ2iTMJHJBJyRfd",
  },
});
```

### List Deployment Files

```javascript
const files = await mcpClient.callTool({
  name: "vercel-list-deployment-files",
  args: {
    id: "dpl_5WJWYSyB7BpgTj3EuwF37WMRBXBtPQ2iTMJHJBJyRfd",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});
```

### List Projects

```javascript
const projects = await mcpClient.callTool({
  name: "vercel-list-projects",
  args: {
    limit: 10,
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
    search: "my-app", // Optional
  },
});
```

### Create a Deployment

```javascript
// Create a basic deployment
const basicDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    target: "production",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});

// Redeploy an existing deployment
const redeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    deploymentId: "dpl_123abc456def",
  },
});

// Create a deployment with Git source (from GitHub)
const gitDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    gitSource: {
      type: "github",
      ref: "main",
    },
    gitMetadata: {
      commitMessage: "add method to measure Interaction to Next Paint",
      commitAuthorName: "developer",
      remoteUrl: "https://github.com/vercel/next.js",
    },
  },
});

// Create a deployment with custom files
const fileDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    name: "my-instant-deployment",
    project: "my-deployment-project",
    files: [
      {
        file: "index.html",
        data: "PGgxPkhlbGxvIFdvcmxkPC9oMT4=", // Base64 encoded <h1>Hello World</h1>
        encoding: "base64",
      },
    ],
    projectSettings: {
      framework: "nextjs",
      buildCommand: "next build",
      installCommand: "npm install",
      nodeVersion: "18.x",
    },
  },
});
```

### Create a New Team

```javascript
const team = await mcpClient.callTool({
  name: "vercel-create-team",
  args: {
    slug: "my-awesome-team",
    name: "My Awesome Team",
  },
});
```

### Create a Custom Environment

```javascript
const customEnv = await mcpClient.callTool({
  name: "vercel-create-custom-environment",
  args: {
    idOrName: "my-project-id",
    name: "staging",
    description: "Staging environment for QA testing",
    branchMatcher: {
      type: "startsWith",
      pattern: "staging/",
    },
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});
```

### Get Project Logs

```javascript
// Get recent application logs
const projectLogs = await mcpClient.callTool({
  name: "vercel-get-project-logs",
  args: {
    projectId: "my-project-id",
    limit: 100,
    level: "error", // Only error logs
    since: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
  },
});

// Get logs from specific source
const runtimeLogs = await mcpClient.callTool({
  name: "vercel-get-project-logs",
  args: {
    projectId: "my-project-id",
    source: "runtime",
    limit: 500,
  },
});
```

### Debug Deployment Issues

```javascript
// Get comprehensive debugging information
const debugInfo = await mcpClient.callTool({
  name: "vercel-debug-deployment",
  args: {
    deploymentId: "dpl_abc123xyz",
    includeMetrics: true,
  },
});

// Get specific deployment logs
const deploymentLogs = await mcpClient.callTool({
  name: "vercel-get-deployment-logs",
  args: {
    deploymentId: "dpl_abc123xyz",
    follow: false,
    limit: 200,
  },
});

// Get runtime errors for troubleshooting
const runtimeErrors = await mcpClient.callTool({
  name: "vercel-get-runtime-errors",
  args: {
    projectId: "my-project-id",
    since: Date.now() - 12 * 60 * 60 * 1000, // Last 12 hours
    status: "500", // Server errors only
  },
});
```

### Search and Analyze Logs

```javascript
// Search for specific error messages
const searchResults = await mcpClient.callTool({
  name: "vercel-search-logs",
  args: {
    query: "TypeError: Cannot read property",
    projectId: "my-project-id",
    level: "error",
    limit: 50,
  },
});

// Get function execution logs
const functionLogs = await mcpClient.callTool({
  name: "vercel-get-function-logs",
  args: {
    functionId: "api/users",
    deploymentId: "dpl_abc123xyz",
    limit: 100,
  },
});
```

### Set Up Log Forwarding

```javascript
// Create log drain for external monitoring
const logDrain = await mcpClient.callTool({
  name: "vercel-create-log-drain",
  args: {
    name: "DataDog Integration",
    projectId: "my-project-id",
    url: "https://http-intake.logs.datadoghq.com/v1/input/YOUR_API_KEY",
    format: "json",
    headers: {
      "DD-API-KEY": "your-datadog-api-key",
      "Content-Type": "application/json",
    },
  },
});

// List existing log drains
const logDrains = await mcpClient.callTool({
  name: "vercel-get-log-drains",
  args: {
    projectId: "my-project-id",
  },
});
```

## 🐳 Docker Deployment

### Build the Image

```bash
docker build -t vercel-mcp .
```

### Run Container

```bash
docker run -it --rm \
  -e VERCEL_API_TOKEN=your_token_here \
  -p 3399:3399 \
  vercel-mcp
```

### Production Deployment

```bash
docker run -d \
  --name vercel-mcp \
  --restart unless-stopped \
  -e VERCEL_API_TOKEN=your_token_here \
  -p 3399:3399 \
  vercel-mcp
```

### Development with Live Reload

```bash
docker build --target builder -t vercel-mcp-dev .
docker run -it --rm \
  -e VERCEL_API_TOKEN=your_token_here \
  -p 3399:3399 \
  -v $(pwd)/src:/app/src \
  vercel-mcp-dev
```

## 🗂️ Project Structure

```
src/
├── constants/       # Tool definitions
├── tools/
│   ├── deployments/ # Deployment handlers
│   │   ├── handlers.ts
│   │   ├── schema.ts
│   │   └── types.ts
│   └── environments/# Environment management
├── utils/          # API helpers
└── index.ts         # Server entrypoint
```

## 🔧 Configuration

### Environment Variables

| Variable           | Description         | Required |
| ------------------ | ------------------- | -------- |
| `VERCEL_API_TOKEN` | Vercel access token | Yes      |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🛠️ Troubleshooting & Known Issues

### Parameter Validation Errors (RESOLVED)

If you were experiencing errors like:
```json
{
  "code": "invalid_type",
  "expected": "string", 
  "received": "undefined",
  "path": ["parameterName"],
  "message": "Required"
}
```

**This has been fixed!** The issue was caused by:

1. **Schema/Handler Mismatch**: Tool definitions using Zod validation schemas that didn't match actual Vercel API requirements
2. **Non-existent API Endpoints**: Some tools were calling hypothetical endpoints that don't exist in the Vercel REST API
3. **Parameter Handling Issues**: Incorrect parameter extraction causing values to be undefined

### ✅ **Current Working Tools**

**✅ Fully Functional:**
- `vercel-list-all-deployments` - List deployments with filtering
- `vercel-get-deployment` - Get deployment details by ID/URL  
- `vercel-list-deployment-files` - List files in a deployment
- `vercel-get-deployment-logs` - Get build logs and deployment events
- `vercel-debug-deployment` - Comprehensive deployment debugging
- `vercel-get-environments` - Get project environment variables
- `vercel-list-projects` - List all projects with filtering
- `vercel-create-project` - Create new projects
- `vercel-create-deployment` - Create new deployments
- `vercel-list-all-teams` - List accessible teams
- `vercel-create-team` - Create new teams
- `vercel-create-environment-variables` - Bulk create environment variables
- `vercel-create-custom-environment` - Create custom deployment environments

**⚠️ Limited Functionality (Documentation/Guidance Only):**
- `vercel-get-project-logs` - **Now requires both projectId AND deploymentId** for runtime logs
- `vercel-get-function-logs` - Provides guidance (function logs are in runtime logs)
- `vercel-search-logs` - Provides guidance (search primarily in dashboard)
- `vercel-get-runtime-errors` - Provides guidance (dashboard feature)
- `vercel-get-build-errors` - Provides guidance (use deployment logs)

**🔒 Pro/Enterprise Features:**
- `vercel-get-log-drains` - Log drain configuration  
- `vercel-create-log-drain` - Create external log aggregation

### 📚 **Correct Tool Usage Examples**

#### ✅ Get Runtime Logs (Fixed)
```json
{
  "name": "vercel-get-project-logs",
  "args": {
    "projectId": "prj_Lguu1nYTot8A0lRe5QzceCiixLOl",
    "deploymentId": "dpl_fKLcALFLXwFieSD3BQBqPypqFnRS",
    "teamId": "team_NjfKUTgJtJLRNjTmopEzMLo8"
  }
}
```

#### ✅ Get Build/Deployment Logs
```json
{
  "name": "vercel-get-deployment-logs", 
  "args": {
    "deploymentId": "dpl_fKLcALFLXwFieSD3BQBqPypqFnRS",
    "teamId": "team_NjfKUTgJtJLRNjTmopEzMLo8"
  }
}
```

#### ✅ Debug Deployment Issues
```json
{
  "name": "vercel-debug-deployment",
  "args": {
    "deploymentId": "dpl_fKLcALFLXwFieSD3BQBqPypqFnRS",
    "teamId": "team_NjfKUTgJtJLRNjTmopEzMLo8"
  }
}
```

#### ✅ List Deployment Files
```json
{
  "name": "vercel-list-deployment-files",
  "args": {
    "id": "dpl_fKLcALFLXwFieSD3BQBqPypqFnRS",
    "teamId": "team_NjfKUTgJtJLRNjTmopEzMLo8"
  }
}
```

### 🔑 **Understanding Vercel API Limitations**

#### Runtime Logs Reality Check
According to Vercel documentation:
- **Runtime logs are primarily a dashboard feature**
- **API access is limited**: `GET /v1/projects/{projectId}/deployments/{deploymentId}/runtime-logs`
- **Requires Pro/Enterprise plans** for extended retention and API access
- **Alternative**: Use Log Drains to export logs to external services

#### Build vs Runtime Logs
- **Build Logs**: Available via `GET /v3/deployments/{id}/events` ✅
- **Runtime Logs**: Limited API access, primarily dashboard-based ⚠️
- **Function Logs**: Included in runtime logs when available ⚠️

### 🎯 **Recommended Debugging Workflow**

1. **Start with Deployment Status**:
   ```json
   {"name": "vercel-get-deployment", "args": {"idOrUrl": "your-deployment-id"}}
   ```

2. **Check Build Logs for Issues**:
   ```json
   {"name": "vercel-get-deployment-logs", "args": {"deploymentId": "your-deployment-id"}}
   ```

3. **Get Comprehensive Debug Info**:
   ```json
   {"name": "vercel-debug-deployment", "args": {"deploymentId": "your-deployment-id"}}
   ```

4. **For Runtime Issues**: Use Vercel Dashboard or set up Log Drains for programmatic access

### 🔧 **API Token Requirements**

Ensure your `VERCEL_API_TOKEN` has appropriate permissions:
- **Team access** if using `teamId` parameters
- **Project access** for the projects you're debugging
- **Pro/Enterprise plan** for advanced logging features

### 📞 **When to Use Dashboard vs API**

**Use MCP Tools For:**
- Deployment status and metadata ✅
- Build logs and errors ✅ 
- File listings and basic debugging ✅
- Bulk operations (deployments, environments) ✅

**Use Vercel Dashboard For:**
- Real-time log streaming 🌐
- Advanced log filtering and search 🔍
- Runtime error analysis 🐛
- Performance monitoring 📊

### 🆘 **Still Having Issues?**

1. **Check your API token permissions**
2. **Verify project/team IDs are correct** 
3. **Ensure you're on the right Vercel plan** for advanced features
4. **Use the corrected tool schemas** as shown in examples above
5. **For runtime debugging**: Combine MCP tools with dashboard investigation
