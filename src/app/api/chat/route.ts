import { openai } from "@ai-sdk/openai";
import { type CoreMessage, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: CoreMessage[] };

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages,
  });

  return result.toAIStreamResponse();
}
