// app/api/chat/route.ts
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

// Use OpenRouter as OpenAI-compatible provider
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Stream from OpenRouter model
    const result = streamText({
      model: openrouter("openai/gpt-oss-20b:free"), // pick any OpenRouter model
      prompt,
    });

    //     Free Models
    // openai/gpt-oss-20b:free
    // z-ai/glm-4.5-air:free
    // google/gemma-3n-e2b-it:free
    // deepseek/deepseek-r1-0528-qwen3-8b:free
    // deepseek/deepseek-r1-0528:free

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
