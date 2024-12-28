import { z } from "zod";

export const DeploymentsArgumentsSchema = z.object({
  app: z.string().optional(),
  limit: z.number().optional(),
  projectId: z.string().optional(),
  state: z.string().optional(),
  target: z.string().optional(),
  teamId: z.string().optional(),
});
