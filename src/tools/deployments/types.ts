export interface Deployment {
  uid: string;
  name: string;
  state: string;
  target: string;
  url: string;
  inspectorUrl: string;
  createdAt: number;
  alias: string[];
  regions: string[];
  builds: {
    src: string;
    use: string;
    config?: Record<string, any>;
  }[];
  meta: {
    githubCommitAuthorName: string;
    githubCommitMessage: string;
    githubRepoId: string;
    githubRepo: string;
  };
}

export interface DeploymentsResponse {
  deployments: Deployment[];
}
