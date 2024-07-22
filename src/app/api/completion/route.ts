import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt: string };

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    prompt,
  });

  return result.toAIStreamResponse();
}
