export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;
  
    // Return the request configuration
    return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    // Check for errors in the HTTP response
    if (ctx.error) {
      return {
        body: null,
        error: ctx.error.message || JSON.stringify(ctx.error),
      };
    }

    if (ctx.result.statusCode !== 200) {
      return {
        body: null,
        error: ctx.result.body || `HTTP error: ${ctx.result.statusCode}`,
      };
    }

    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);

    // Check if content exists in the response
    if (!parsedBody.content || !parsedBody.content[0]) {
      return {
        body: null,
        error: JSON.stringify(parsedBody),
      };
    }

    // Extract the text content from the response
    const res = {
      body: parsedBody.content[0].text,
    };
    // Return the response
    return res;
  }