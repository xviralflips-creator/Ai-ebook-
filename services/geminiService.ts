import { GoogleGenAI, Type } from "@google/genai";
import { StorySettings, StoryPage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image'; // "Nano Banana" equivalent per instructions

export const generateStoryStructure = async (settings: StorySettings): Promise<{ title: string; description: string; pages: Omit<StoryPage, 'imageUrl'>[] }> => {
  try {
    const prompt = `
      Create a children's story based on the following settings:
      Topic: ${settings.topic}
      Genre: ${settings.genre}
      Target Age: ${settings.ageGroup}
      Length: ${settings.pageCount} pages.

      Return the response in JSON format.
      The story should be engaging and appropriate for the age group.
      For each page, provide the story text and a detailed image generation prompt that describes the scene visually in the style of ${settings.artStyle}.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING, description: "A detailed visual description for an AI image generator" }
                },
                required: ["pageNumber", "text", "imagePrompt"]
              }
            }
          },
          required: ["title", "description", "pages"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text response from Gemini");
    
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error generating story structure:", error);
    throw error;
  }
};

export const generateIllustration = async (prompt: string, artStyle: string): Promise<string> => {
  try {
    // Enhance prompt for image model
    const enhancedPrompt = `Create a ${artStyle} style illustration. ${prompt}. High quality, detailed, colorful.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        // Image generation doesn't use standard responseMimeType for JSON
        // We look for inlineData in parts
      }
    });

    // Extract image from response
    let base64Image = '';
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No image data found in response");
    }

    return base64Image;

  } catch (error) {
    console.error("Error generating illustration:", error);
    // Return a placeholder if generation fails to avoid breaking the UI flow entirely
    return `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
  }
};
