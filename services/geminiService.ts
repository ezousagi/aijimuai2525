import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Story, MoodType } from "../types.ts";
import { SYSTEM_PROMPT, FALLBACK_STORY } from "../constants.ts";

const storySchema: Schema = {
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
};

export const generateStoryForMood = async (mood: MoodType): Promise<Story> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key missing. Using fallback.");
    await new Promise(r => setTimeout(r, 1000));
    return { ...FALLBACK_STORY, id: 'fallback-' + Date.now() };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `気分: ${mood}。この気分に寄り添う物語を書いてください。`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: 0.7,
      },
    });

    const data = JSON.parse(textResponse.text || "{}");
    let imageUrl: string | undefined = undefined;
    
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Anime style, gentle atmospheric, ${data.visualSuggestion}` }] },
        config: { imageConfig: { aspectRatio: "9:16" } },
      });

      const part = imageResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part) imageUrl = `data:image/png;base64,${part.inlineData.data}`;
    } catch (e) { console.warn("Image fail:", e); }

    return {
      id: Date.now().toString(),
      ...data,
      imageUrl,
      tags: [mood]
    };
  } catch (error) {
    console.error("Gemini fail:", error);
    return { ...FALLBACK_STORY, id: 'err-' + Date.now() };
  }
};