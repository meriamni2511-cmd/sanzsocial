
import { GoogleGenAI, Type } from "@google/genai";
import { SocialCommandIntent } from "../types";

// Always initialize GoogleGenAI with { apiKey: process.env.API_KEY } inside function calls 
// to ensure the latest environment variables are used and to follow guidelines.

export const parseSocialCommand = async (userInput: string): Promise<SocialCommandIntent> => {
  // Initialize AI client per-call as recommended
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this user command for a social media AI agent: "${userInput}". 
    Identify the action, platforms (twitter, instagram, linkedin, facebook, youtube, threads, tiktok, bluesky, reddit, pinterest, gmb, telegram), title, and specific options.
    Respond ONLY in JSON format following the SocialCommandIntent interface.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, description: "POST, SCHEDULE, or ANALYZE" },
          platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          options: {
            type: Type.OBJECT,
            properties: {
              youtube: {
                type: Type.OBJECT,
                properties: { visibility: { type: Type.STRING } }
              },
              instagram: {
                type: Type.OBJECT,
                properties: { postType: { type: Type.STRING } }
              }
            }
          }
        },
        required: ["action", "platforms"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const chatWithAssistant = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  // Initialize AI client per-call as recommended
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history,
    config: {
      systemInstruction: `You are Bina.ai's Social Orchestration Assistant. 
      You help users manage their social media. 
      Be concise, professional, and helpful. 
      If the user wants to post or schedule something, acknowledge it warmly.
      You can handle Malaysian (Malay) and English queries fluently.`,
    }
  });

  return response.text;
};

export const streamPostContent = async (prompt: string, onChunk: (text: string) => void) => {
  // Initialize AI client per-call as recommended
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const stream = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: `Generate a viral-ready social media post for: ${prompt}. Use a friendly yet professional tone.`,
  });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) onChunk(text);
  }
};

export const generatePostImage = async (description: string): Promise<string | null> => {
  // Initialize AI client per-call as recommended
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality social media graphic for: ${description}. Professional, modern aesthetic.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Correctly iterate through parts to extract the generated image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return null;
};
