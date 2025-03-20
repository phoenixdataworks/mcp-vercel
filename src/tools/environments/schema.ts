import { z } from "zod";

export const EnvironmentVariableSchema = z.object({
  type: z.string(),
  value: z.string(),
  target: z.array(z.string()).optional(),
  gitBranch: z.string().optional(),
});

export const CreateEnvironmentSchema = z.object({
  projectId: z.string(),
  key: z.string(),
  value: z.string(),
  target: z.array(z.string()).optional(),
  type: z.string().optional(),
  gitBranch: z.string().optional(),
});
