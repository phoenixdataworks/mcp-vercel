import { z } from "zod";

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
