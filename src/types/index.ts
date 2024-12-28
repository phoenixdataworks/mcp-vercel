export interface DeploymentResponse {
  uid: string;
  name: string;
  url: string;
  state: string;
  target: string;
  createdAt: string;
  source: string;
  inspectorUrl: string;
  creator: {
    uid: string;
    username: string;
    email: string;
    githubLogin: string;
  };
  meta: {
    githubCommitAuthorName: string;
    githubCommitMessage: string;
    githubCommitRepo: string;
    githubRepoId: string;
    githubRepoVisibility: string;
  };
}
export interface DeploymentsResponse {
  results: Array<DeploymentResponse>;
}
