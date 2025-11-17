import { convertToModelMessages, streamText } from "ai";

import {
  retrieveRelevantChunks,
  formatRetrievedChunks,
} from "@/lib/retrieve-embedding";

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const userMessage =
      messages[messages.length - 1]?.content ||
      messages[messages.length - 1]?.parts?.map((p: any) => p.text).join("") ||
      "";
    const modelMessages = convertToModelMessages(messages);


    // RAG Retrieval
    const matches = await retrieveRelevantChunks(userMessage);
    const context = formatRetrievedChunks(matches);

    const systemPrompt = `
    Use ONLY the following context to answer the user's question.
    If the answer is not found, suggest them to contact the support team at lyeabsra@gmail.com.

    ---CONTEXT---
    ${context}
    ----------------
`;

    const result = await streamText({
      model: "openai/gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        ...modelMessages,
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
