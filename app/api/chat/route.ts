import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// In a real production app, this would be read from process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, modelTier } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Hardcoded to the model explicitly requested by the user
    const actualModelString = "gemini-3.1-flash-lite";
    let model = genAI.getGenerativeModel({ model: actualModelString });

    // Extract the latest message
    const latestMessageObj = messages[messages.length - 1];
    const latestMessageText = latestMessageObj.content;
    const imageUrl = latestMessageObj.imageUrl;

    // Convert previous messages to Gemini format (history)
    const rawHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Gemini requires history to start with a 'user' message. 
    // Strip leading 'model' messages (like the initial greeting).
    const history = [];
    let foundUser = false;
    for (const msg of rawHistory) {
      if (msg.role === "user") foundUser = true;
      if (foundUser) history.push(msg);
    }

    // Start a chat session with history
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    let payload: any = latestMessageText;

    // If there is an image, fetch it and convert to base64 for Gemini
    if (imageUrl) {
      try {
        const imageRes = await fetch(imageUrl);
        const arrayBuffer = await imageRes.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = imageRes.headers.get("content-type") || "image/jpeg";

        payload = [
          { text: latestMessageText || "Describe this image in detail." },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ];
      } catch (err) {
        console.error("Error fetching image from Firebase Storage:", err);
      }
    }

    // Stream the response back
    const result = await chat.sendMessageStream(payload);
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
        } catch (e) {
          console.error("Stream error:", e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
