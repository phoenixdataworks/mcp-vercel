import { vercelFetch } from "../../utils/api.js";
import { GetEnvironmentsParams } from "./type.js";

/**
 * Retrieves environment variables for a Vercel project specified by ID or name
 * @param params - Parameters containing the ID or name of the project
 * @returns A formatted response containing the environment variables or an error message
 */
export async function handleGetEnvironments(params: GetEnvironmentsParams) {
  try {
    // Validation des paramètres d'entrée
    if (!params || !params.arguments) {
      const errorMsg = "Invalid request: Missing required arguments";
      console.error(errorMsg);
      return {
        content: [{ type: "text", text: errorMsg }],
      };
    }

    const { idOrName } = params.arguments;

    if (!idOrName || typeof idOrName !== "string") {
      const errorMsg = `Invalid request: idOrName parameter must be a non-empty string, received: ${JSON.stringify(
        idOrName,
      )}`;
      console.error(errorMsg);
      return {
        content: [{ type: "text", text: errorMsg }],
      };
    }

    console.log(`Fetching environment variables for project: ${idOrName}`);

    // Appel à l'API Vercel v10
    const data = await vercelFetch<any>(
      `v10/projects/${encodeURIComponent(idOrName)}/env`,
      { method: "GET" },
    );

    // Validation de la réponse
    if (!data || !data.envs || !Array.isArray(data.envs)) {
      const errorMsg = `Failed to retrieve environment variables for project: ${idOrName}`;
      console.error(errorMsg, { data });
      return {
        content: [{ type: "text", text: errorMsg }],
      };
    }

    // Formatage de la réponse réussie
    const envCount = data.envs.length;
    return {
      content: [
        {
          type: "text",
          text: `Retrieving ${envCount} environment variable${
            envCount !== 1 ? "s" : ""
          } for project: ${idOrName}`,
        },
        {
          type: "text",
          text: JSON.stringify(data.envs, null, 2),
        },
      ],
    };
  } catch (error) {
    // Gestion des erreurs
    const errorMsg =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);

    console.error("Error retrieving environment variables:", error);

    return {
      content: [
        {
          type: "text",
          text: `Error retrieving environment variables: ${errorMsg}`,
        },
      ],
    };
  }
}
