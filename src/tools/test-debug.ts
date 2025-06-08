/**
 * Minimal test handler to debug parameter passing
 */
export async function handleTestDebug(params: any = {}) {
  return {
    content: [
      {
        type: "text",
        text: `DEBUG TEST - Received params: ${JSON.stringify(params, null, 2)}`
      },
      {
        type: "text", 
        text: `DEBUG TEST - Params type: ${typeof params}`
      },
      {
        type: "text",
        text: `DEBUG TEST - Params keys: ${Object.keys(params || {}).join(', ')}`
      },
      {
        type: "text",
        text: `DEBUG TEST - Is null/undefined: ${params === null ? 'null' : params === undefined ? 'undefined' : 'has value'}`
      }
    ],
  };
} 