import { z } from "zod";

export const ListDeploymentsArgumentsSchema = z.object({
  app: z.string().optional(),
  limit: z.number().optional(),
  projectId: z.string().optional(),
  state: z.string().optional(),
  target: z.string().optional(),
  teamId: z.string().optional(),
});

export const GetDeploymentArgumentsSchema = z.object({
  idOrUrl: z.string(),
  teamId: z.string().optional(),
});
