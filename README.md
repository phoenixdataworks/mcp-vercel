# Vercel MCP Integration

A Model Context Protocol (MCP) integration for Vercel's REST API, providing programmatic access to Vercel deployment management.

## 📋 Overview <sub><sup>Last updated: August 2024</sup></sub>

This MCP server implements Vercel's core API endpoints as tools, enabling:

- Deployment monitoring & management
- Environment variable retrieval
- Project deployment status tracking
- Team creation and management
- CI/CD pipeline integration

## ✨ Features

### Current Tools

- `vercel-list-all-deployments` - List deployments with filtering
- `vercel-get-deployment` - Retrieve specific deployment details
- `vercel-create-deployment` - Create new deployments
- `vercel-create-project` - Create new Vercel projects
- `vercel-create-environment-variables` - Create multiple environment variables
- `vercel-get-environments` - Access project environment variables
- `vercel-list-projects` - List all projects with pagination
- `vercel-list-all-teams` - List all accessible teams
- `vercel-create-team` - Create a new team with custom slug and name

## 🛣️ Roadmap

- [x] Deployment creation workflow
- [x] Project management tools
- [x] Team management integration (List & Create teams)
- [ ] Real-time deployment monitoring
- [ ] Advanced error handling
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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Vercel API Token
- MCP Client

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

2. Start MCP server:

```bash
npm start
```

## 🛠️ Usage Examples

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

### List Projects

```javascript
const projects = await mcpClient.callTool({
  name: "vercel-list-projects",
  args: {
    limit: 10,
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
    search: "my-app" // Optional
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
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l" // Optional
  }
});

// Redeploy an existing deployment
const redeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    deploymentId: "dpl_123abc456def"
  }
});

// Create a deployment with Git source (from GitHub)
const gitDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    gitSource: {
      type: "github",
      ref: "main"
    },
    gitMetadata: {
      commitMessage: "add method to measure Interaction to Next Paint",
      commitAuthorName: "developer",
      remoteUrl: "https://github.com/vercel/next.js"
    }
  }
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
        encoding: "base64"
      }
    ],
    projectSettings: {
      framework: "nextjs",
      buildCommand: "next build",
      installCommand: "npm install",
      nodeVersion: "18.x"
    }
  }
});
```

### Create a New Team

```javascript
const team = await mcpClient.callTool({
  name: "vercel-create-team",
  args: {
    slug: "my-awesome-team",
    name: "My Awesome Team"
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
