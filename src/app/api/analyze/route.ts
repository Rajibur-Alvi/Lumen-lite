import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { AnalysisSchema } from "@/lib/schema";
import { researchClient } from "@/lib/researcher";
import { queryMemory } from "@/lib/memory";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { transcript, clientName, industry } = await req.json();
    
    // Step 1 & 2: Parallel Research and Memory Retrieval
    const [researchData, memoryContext] = await Promise.all([
      clientName ? researchClient(clientName, industry || "") : Promise.resolve(null),
      queryMemory(transcript),
    ]);

    const result = await streamObject({
      model: google("gemini-1.5-flash"),
      schema: AnalysisSchema,
      prompt: `
        Analyze this discovery call transcript and generate a structured pitch deck.

        Transcript: ${transcript}
        ${researchData ? `\nClient research:\n${JSON.stringify(researchData)}` : ""}
        ${memoryContext?.length ? `\nPast strategies:\n${memoryContext.join("\n")}` : ""}
      `.trim(),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response("Server Error", { status: 500 });
  }
}
