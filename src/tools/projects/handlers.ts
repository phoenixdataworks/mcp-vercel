import { vercelFetch } from "../../utils/api.js";
import { CreateProjectArgumentsSchema } from "./schema.js";
import type { ProjectResponse } from "./types.js";

export async function handleCreateProject(params: any = {}) {
  try {
    const {
      name,
      framework,
      buildCommand,
      devCommand,
      installCommand,
      outputDirectory,
      publicSource,
      rootDirectory,
      serverlessFunctionRegion,
      skipGitConnectDuringLink,
      teamId,
    } = CreateProjectArgumentsSchema.parse(params);

    const url = `v11/projects${teamId ? `?teamId=${teamId}` : ""}`;

    const projectData = {
      name,
      framework,
      buildCommand,
      devCommand,
      installCommand,
      outputDirectory,
      publicSource,
      rootDirectory,
      serverlessFunctionRegion,
      skipGitConnectDuringLink,
    };

    const data = await vercelFetch<ProjectResponse>(url, {
      method: "POST",
      body: JSON.stringify(projectData),
    });

    return {
      content: [
        {
          type: "text",
          text: `Project ${data?.name} (${data?.id}) created successfully`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Failed to create project"
          }`,
          isError: true,
        },
      ],
    };
  }
}
