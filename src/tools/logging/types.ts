export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  source: 'runtime' | 'build' | 'function' | 'edge-function';
  deployment?: string;
  projectId?: string;
  functionId?: string;
  requestId?: string;
  region?: string;
  metadata?: Record<string, any>;
}

export interface LogsResponse {
  logs: LogEntry[];
  pagination?: {
    hasMore: boolean;
    nextCursor?: string;
    totalCount?: number;
  };
}

export interface DeploymentLog {
  id: string;
  timestamp: string;
  type: 'build' | 'deployment' | 'function' | 'static';
  message: string;
  level: 'info' | 'warning' | 'error';
  deploymentId: string;
  buildId?: string;
  functionName?: string;
  phase?: 'queued' | 'building' | 'deploying' | 'ready' | 'error' | 'canceled';
}

export interface DeploymentLogsResponse {
  logs: DeploymentLog[];
  pagination?: {
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface FunctionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  functionName: string;
  deploymentId: string;
  requestId?: string;
  region?: string;
  duration?: number;
  memory?: number;
  source: 'runtime' | 'cold-start' | 'warm-start';
}

export interface FunctionLogsResponse {
  logs: FunctionLog[];
  pagination?: {
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface LogDrain {
  id: string;
  name: string;
  url: string;
  headers?: Record<string, string>;
  format: 'json' | 'ndjson' | 'syslog';
  sources: Array<'static' | 'build' | 'function' | 'edge-function'>;
  projectId?: string;
  teamId?: string;
  created: string;
  updated: string;
  status: 'active' | 'paused' | 'error';
}

export interface LogDrainsResponse {
  drains: LogDrain[];
  pagination?: {
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface LogSearchFilter {
  query?: string;
  level?: 'error' | 'warning' | 'info' | 'debug';
  source?: 'runtime' | 'build' | 'function' | 'edge-function';
  from?: string;
  to?: string;
  since?: string;
  until?: string;
  limit?: number;
  cursor?: string;
}

export interface ErrorReport {
  id: string;
  timestamp: string;
  message: string;
  stackTrace?: string;
  type: 'runtime' | 'build' | 'function';
  deploymentId: string;
  projectId: string;
  functionName?: string;
  region?: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface ErrorReportsResponse {
  errors: ErrorReport[];
  pagination?: {
    hasMore: boolean;
    nextCursor?: string;
  };
} 