import { Configuration, OpenAIApi } from "openai";
import { useContext } from "react";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  let prompt = cleanPromptAddContext(req.body.prompt, req.body.context) || "";

  console.log(prompt);

  const modelName = req.body.modelName || "";
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: modelName,
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

// function useFullWrittenPrompt(text){

// }

function cleanPromptAddContext(prompt, ctx) {
  prompt = "q:" + prompt;
  if (
    prompt.charAt(prompt.length - 1) !== "." ||
    prompt.charAt(prompt.length - 1) !== "?"
  ) {
    prompt += "?";
  }
  ctx.forEach((ctxStr, i) => {
    prompt = `Q:${ctxStr.q} A:${ctxStr.a}) ${prompt}`;
    if (ctx.length === i + 1) {
      prompt = `previous conversation( ${prompt}`;
    }
  });
  return prompt;
}

function generatePrompt(prompt) {
  const capitalizedprompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
  return `Suggest three names for an prompt that is a superhero.

prompt: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
prompt: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
prompt: ${capitalizedprompt}
Names:`;
}
