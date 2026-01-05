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
  // process.env が存在しない環境でも安全に取得
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

  if (!apiKey) {
    console.warn("API Key is missing. Check your environment settings.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { ...FALLBACK_STORY, id: 'fallback-' + Date.now() };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is feeling: ${mood}. Please write a story for them.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: storySchema,
        temperature: 0.7,
      },
    });

    const textJson = textResponse.text;
    if (!textJson) throw new Error("No response text from Gemini");
    const data = JSON.parse(textJson);

    let imageUrl: string | undefined = undefined;
    
    try {
      const visualPrompt = `Anime style landscape, gentle, atmospheric, lo-fi, studio ghibli style. ${data.visualSuggestion}`;
      
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: visualPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
          },
        },
      });

      if (imageResponse.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imageError) {
      console.warn("Image generation failed:", imageError);
    }

    return {
      id: Date.now().toString(),
      title: data.title,
      intro: data.intro,
      body: data.body,
      reframe: data.reframe,
      action: data.action,
      source: data.source || "出典不明",
      readTime: data.readTime,
      bgmSuggestion: data.bgmSuggestion || "calm",
      visualSuggestion: data.visualSuggestion || "nature",
      imageUrl: imageUrl,
      tags: [mood]
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return { ...FALLBACK_STORY, id: 'error-fallback-' + Date.now() };
  }
};