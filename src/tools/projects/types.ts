export interface Project {
  id: string;
  name: string;
  framework: string | null;
  latestDeployments: {
    alias: string[];
  }[];
  targets: {
    production: {
      alias: string[];
    };
  };
  createdAt: number;
}

export interface ProjectResponse {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  updatedAt: number;
  framework: string | null;
  devCommand: string | null;
  installCommand: string | null;
  buildCommand: string | null;
  outputDirectory: string | null;
  rootDirectory: string | null;
  serverlessFunctionRegion: string | null;
  publicSource: boolean | null;
}
