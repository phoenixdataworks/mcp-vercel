import { vercelFetch } from "../../utils/api.js";
import { 
  CreateProjectArgumentsSchema,
  CreateEnvironmentVariablesSchema
} from "./schema.js";
import type { ProjectResponse, EnvironmentVariablesResponse } from "./types.js";

export async function handleCreateEnvironmentVariables(params: any = {}) {
  try {
    const { projectId, teamId, environmentVariables } = CreateEnvironmentVariablesSchema.parse(params);
    
    const url = `v10/projects/${encodeURIComponent(projectId)}/env${teamId ? `?teamId=${teamId}` : ""}`;
    
    const data = await vercelFetch<EnvironmentVariablesResponse>(url, {
      method: "POST",
      body: JSON.stringify(environmentVariables),
    });

    return {
      content: [
        {
          type: "text",
          text: `Successfully created ${data?.created.length} environment variables`,
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
            error instanceof Error ? error.message : "Failed to create environment variables"
          }`,
          isError: true,
        },
      ],
    };
  }
}

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
