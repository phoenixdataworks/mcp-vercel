export interface DeploymentConfig {
  name: string;
  projectId?: string;
  files: Array<{
    file: string;
    data: string | Buffer;
  }>;
  environment?: Record<string, string>;
}
