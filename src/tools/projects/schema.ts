import { z } from "zod";

export const EnvironmentVariableSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  target: z.array(z.enum(['production', 'preview', 'development']),
  type: z.enum(['system', 'encrypted', 'plain', 'sensitive']),
  gitBranch: z.string().optional(),
});

export const CreateEnvironmentVariablesSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  teamId: z.string().optional(),
  environmentVariables: z.array(EnvironmentVariableSchema).min(1),
});

export const CreateProjectArgumentsSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  framework: z.string().optional(),
  buildCommand: z.string().optional(),
  devCommand: z.string().optional(),
  installCommand: z.string().optional(),
  outputDirectory: z.string().optional(),
  publicSource: z.boolean().optional(),
  rootDirectory: z.string().optional(),
  serverlessFunctionRegion: z.string().optional(),
  skipGitConnectDuringLink: z.boolean().optional(),
  teamId: z.string().min(1, "Team ID is required"),
});
