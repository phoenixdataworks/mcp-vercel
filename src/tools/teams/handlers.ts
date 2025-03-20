import { z } from "zod";
import { vercelFetch } from "../../utils/api.js";
import { ListTeamsArgumentsSchema } from "./schema.js";
import type { TeamsResponse } from "./types.js";

export async function handleListTeams(params: any = {}) {
  try {
    const { limit, since, until, teamId } = ListTeamsArgumentsSchema.parse(params);
    
    let url = "v2/teams";
    const queryParams = new URLSearchParams();
    
    if (limit) queryParams.append("limit", limit.toString());
    if (since) queryParams.append("since", since.toString());
    if (until) queryParams.append("until", until.toString());
    if (teamId) queryParams.append("teamId", teamId);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch<TeamsResponse>(url);

    return {
      content: [
        {
          type: "text",
          text: `Found ${data.teams.length} teams`,
        },
        {
          type: "text",
          text: JSON.stringify(data.teams, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Failed to list teams"}`,
          isError: true,
        },
      ],
    };
  }
}
