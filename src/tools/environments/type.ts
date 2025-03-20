// Interface for the environment variables according to the Vercel v10 API
export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  target: string[];
  type: string;
  configurationId: string | null;
  createdAt: number;
  updatedAt: number;
  gitBranch?: string;
}

export interface EnvironmentVariablesResponse {
  envs: EnvironmentVariable[];
}

//  Interface for the input parameters
export interface GetEnvironmentsParams {
  arguments: {
    idOrName: string;
  };
}
