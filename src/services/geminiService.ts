import { GoogleGenAI } from "@google/genai";

export async function generateAIContent(prompt: string, context?: any) {
  // Always create a new instance as per guidelines
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Determine the system instruction from context or use default
    const systemInstruction = context?.systemPrompt || "You are an AI assistant for HELPP, an NGO platform. Provide helpful, accurate information about campaigns and donations. Keep responses concise and impactful.";
    
    // Check if the prompt suggests JSON response
    const isJsonRequested = prompt.toLowerCase().includes("json");

    // Use the model recommended for basic text tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [{ text: `Additional Context: ${JSON.stringify(context?.history || {})}\n\nUser Question: ${prompt}` }]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: isJsonRequested ? "application/json" : "text/plain",
        tools: context?.useSearch ? [{ googleSearch: {} }] : undefined
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return text;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // If the error is specific to JSON mode or model availability, log it
    if (error.message?.includes("500") || error.message?.includes("xhr")) {
       console.error("This looks like a transient proxy or model availability issue.");
    }

    throw new Error("AI generation failed");
  }
}
