import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    const prompt = `
    Analyze this meeting transcript and return a JSON object.
    
    TRANSCRIPT:
    ${transcript}
    
    JSON STRUCTURE:
    {
      "clientInfo": {
        "name": "string",
        "industry": "string",
        "painPoints": ["string"]
      },
      "roi": {
        "monthlyBleed": "string",
        "timeline": "string",
        "urgencyScore": number
      },
      "strategy": {
        "keyMessage": "string",
        "objections": [{"claim": "string", "response": "string"}]
      },
      "slides": [
        {
          "slideNumber": number,
          "title": "string",
          "content": ["string"],
          "speakerNotes": "string",
          "layout": "title | content | metrics"
        }
      ]
    }
    
    Return ONLY valid JSON. Max slides: 15.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    return NextResponse.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
