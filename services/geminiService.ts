import { GoogleGenAI, Type } from "@google/genai";
import { Story, MoodType } from "../types.ts";
import { SYSTEM_PROMPT, FALLBACK_STORY } from "../constants.ts";

export const generateStoryForMood = async (mood: MoodType): Promise<Story> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key missing. Using fallback story.");
    await new Promise(r => setTimeout(r, 1500));
    return { ...FALLBACK_STORY, id: 'fallback-' + Date.now() };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `気分: ${mood}。この気分に寄り添い、心を穏やかにする物語を書いてください。`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            intro: { type: Type.STRING },
            body: { type: Type.STRING },
            reframe: { type: Type.STRING },
            action: { type: Type.STRING },
            source: { type: Type.STRING },
            readTime: { type: Type.STRING },
            bgmSuggestion: { type: Type.STRING },
            visualSuggestion: { type: Type.STRING },
          },
          required: ["title", "intro", "body", "reframe", "action", "source", "readTime", "visualSuggestion"],
        },
        temperature: 0.8,
      },
    });

    const data = JSON.parse(textResponse.text || "{}");
    let imageUrl: string | undefined = undefined;
    
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { 
          parts: [{ text: `High quality anime style background art, soft lighting, atmospheric, ${data.visualSuggestion}` }] 
        },
        config: { 
          imageConfig: { aspectRatio: "9:16" } 
        },
      });

      const imagePart = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart && imagePart.inlineData) {
        imageUrl = `data:image/png;base64,${imagePart.inlineData.data}`;
      }
    } catch (imageError) {
      console.warn("Image generation failed, proceeding with text only:", imageError);
    }

    return {
      id: Date.now().toString(),
      ...data,
      imageUrl,
      tags: [mood]
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return { ...FALLBACK_STORY, id: 'err-' + Date.now() };
  }
};