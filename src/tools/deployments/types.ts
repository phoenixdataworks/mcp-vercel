export interface Deployment {
  uid: string;
  name: string;
  state: string;
  target: string;
  url: string;
  inspectorUrl: string;
  createdAt: number;
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
