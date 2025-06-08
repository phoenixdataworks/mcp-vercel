import { z } from "zod";

export const GetProjectLogsArgumentsSchema = z.object({
  projectId: z.string().describe("The project ID to get logs for"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  since: z.string().optional().describe("ISO timestamp to start from (e.g., '2024-01-01T00:00:00Z')"),
  until: z.string().optional().describe("ISO timestamp to end at (e.g., '2024-01-01T23:59:59Z')"),
  limit: z.number().min(1).max(1000).default(100).describe("Number of log entries to return (1-1000)"),
  level: z.enum(['error', 'warning', 'info', 'debug']).optional().describe("Filter by log level"),
  source: z.enum(['runtime', 'build', 'function', 'edge-function']).optional().describe("Filter by log source"),
  cursor: z.string().optional().describe("Pagination cursor for next set of results"),
});

export const GetDeploymentLogsArgumentsSchema = z.object({
  deploymentId: z.string().describe("The deployment ID to get logs for"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  follow: z.boolean().default(false).describe("Follow logs in real-time"),
  since: z.string().optional().describe("ISO timestamp to start from"),
  until: z.string().optional().describe("ISO timestamp to end at"),
  limit: z.number().min(1).max(1000).default(100).describe("Number of log entries to return"),
  cursor: z.string().optional().describe("Pagination cursor"),
});

export const GetFunctionLogsArgumentsSchema = z.object({
  functionId: z.string().describe("The function ID to get logs for"),
  deploymentId: z.string().optional().describe("Filter by specific deployment"),
  projectId: z.string().optional().describe("The project ID containing the function"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  since: z.string().optional().describe("ISO timestamp to start from"),
  until: z.string().optional().describe("ISO timestamp to end at"),
  limit: z.number().min(1).max(1000).default(100).describe("Number of log entries to return"),
  level: z.enum(['error', 'warning', 'info', 'debug']).optional().describe("Filter by log level"),
  cursor: z.string().optional().describe("Pagination cursor"),
});

export const SearchLogsArgumentsSchema = z.object({
  projectId: z.string().describe("The project ID to search logs in"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  query: z.string().describe("Search query string"),
  since: z.string().optional().describe("ISO timestamp to start from"),
  until: z.string().optional().describe("ISO timestamp to end at"),
  limit: z.number().min(1).max(1000).default(100).describe("Number of log entries to return"),
  level: z.enum(['error', 'warning', 'info', 'debug']).optional().describe("Filter by log level"),
  source: z.enum(['runtime', 'build', 'function', 'edge-function']).optional().describe("Filter by log source"),
  cursor: z.string().optional().describe("Pagination cursor"),
});

export const GetLogDrainsArgumentsSchema = z.object({
  projectId: z.string().optional().describe("Filter by project ID"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  limit: z.number().min(1).max(100).default(20).describe("Number of log drains to return"),
  cursor: z.string().optional().describe("Pagination cursor"),
});

export const CreateLogDrainArgumentsSchema = z.object({
  name: z.string().describe("Name for the log drain"),
  url: z.string().url().describe("Destination URL for log delivery"),
  projectId: z.string().optional().describe("Project ID to associate with (optional for team-level drains)"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  headers: z.record(z.string()).optional().describe("Additional headers to send with logs"),
  format: z.enum(['json', 'ndjson', 'syslog']).default('json').describe("Log format"),
  sources: z.array(z.enum(['static', 'build', 'function', 'edge-function'])).default(['static', 'build', 'function', 'edge-function']).describe("Log sources to include"),
});

export const GetRuntimeErrorsArgumentsSchema = z.object({
  projectId: z.string().describe("The project ID to get errors for"),
  deploymentId: z.string().optional().describe("Filter by specific deployment"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  since: z.string().optional().describe("ISO timestamp to start from"),
  until: z.string().optional().describe("ISO timestamp to end at"),
  limit: z.number().min(1).max(100).default(20).describe("Number of error reports to return"),
  status: z.enum(['new', 'acknowledged', 'resolved']).optional().describe("Filter by error status"),
  cursor: z.string().optional().describe("Pagination cursor"),
});

export const GetBuildErrorsArgumentsSchema = z.object({
  deploymentId: z.string().describe("The deployment ID to get build errors for"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  limit: z.number().min(1).max(100).default(20).describe("Number of build errors to return"),
});

export const DebugDeploymentArgumentsSchema = z.object({
  deploymentId: z.string().describe("The deployment ID to debug"),
  teamId: z.string().optional().describe("Team ID to scope the request"),
  includeSystemLogs: z.boolean().default(true).describe("Include system/infrastructure logs"),
  includeApplicationLogs: z.boolean().default(true).describe("Include application runtime logs"),
  includeBuildLogs: z.boolean().default(true).describe("Include build process logs"),
  since: z.string().optional().describe("ISO timestamp to start investigation from"),
}); 