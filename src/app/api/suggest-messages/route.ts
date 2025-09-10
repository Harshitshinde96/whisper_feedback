// app/api/suggest-messages/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  // console.log("API Route called");

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. and in response directly give sentences dont give anything like `Here are three open-ended and engaging questions formatted as requested:` just give in the format you have been told ";

    // Make NON-streaming request to OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Anonymous Messaging App",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          messages: [{ role: "user", content: prompt }],
          stream: false, // Important: set to false
          max_tokens: 500,
        }),
      }
    );

    //     Free Models
    // openai/gpt-oss-20b:free
    // z-ai/glm-4.5-air:free
    // google/gemma-3n-e2b-it:free
    // deepseek/deepseek-r1-0528-qwen3-8b:free
    // deepseek/deepseek-r1-0528:free

    if (!response.ok) {
      const errorData = await response.text();
      // console.error("OpenRouter API error:", response.status, errorData);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log("API response:", data);

    // Extract the content from the response
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    return NextResponse.json({ message: content });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// import { streamText } from "ai";
// import { createOpenAI } from "@ai-sdk/openai";
// import { NextResponse } from "next/server";

// // Use OpenRouter as OpenAI-compatible provider
// const openrouter = createOpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY!,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// export const runtime = "edge";

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     // Stream from OpenRouter model
//     const result = streamText({
//       model: openrouter("z-ai/glm-4.5-air:free"), // pick any OpenRouter model
//       prompt,
//     });

//     //     Free Models
//     // openai/gpt-oss-20b:free
//     // z-ai/glm-4.5-air:free
//     // google/gemma-3n-e2b-it:free
//     // deepseek/deepseek-r1-0528-qwen3-8b:free
//     // deepseek/deepseek-r1-0528:free

//     return result.toTextStreamResponse();
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

// import { streamText } from "ai";
// import { createOpenAI } from "@ai-sdk/openai";
// import { NextResponse } from "next/server";

// // Use OpenRouter as OpenAI-compatible provider
// const openrouter = createOpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY!,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// export const runtime = "edge";

// export async function POST(req: Request) {
//   console.log("API Route called");

//   try {
//     // Check if API key exists
//     if (!process.env.OPENROUTER_API_KEY) {
//       console.error("Missing OPENROUTER_API_KEY");
//       return NextResponse.json({ error: "Missing API key" }, { status: 500 });
//     }

//     console.log("API Key exists, making request...");

//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     // Stream from OpenRouter model
//     const result = streamText({
//       model: openrouter("openai/gpt-oss-20b:free"),
//       prompt,
//     });

//     console.log("Request successful, returning stream...");

//     // Return the stream response - use toTextStreamResponse for Edge runtime
//     return result.toTextStreamResponse();
//   } catch (error) {
//     console.error("API Route Error:", error);
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
