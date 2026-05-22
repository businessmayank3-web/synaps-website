import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Hardcoded for the demo so it's guaranteed to be loaded and never exposed to the frontend.
// In a real production app, this would be read from process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI("AIzaSyDwr03p7jkvpKzTJv-hGEa4DeUu1mpqNB4");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Extract the latest message
    const latestMessage = messages[messages.length - 1].content;

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

    // Send the latest message
    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
