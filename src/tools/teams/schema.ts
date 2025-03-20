import { z } from "zod";

export const ListTeamsArgumentsSchema = z.object({
  limit: z.number().optional(),
  since: z.number().optional(),
  until: z.number().optional(),
  teamId: z.string().optional(),
});
