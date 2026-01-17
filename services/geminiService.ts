import { GoogleGenAI, Type } from "@google/genai";
import { StorySettings, StoryPage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models configuration based on latest Google AI Studio guidelines
const TEXT_MODEL = "gemini-3-flash-preview"; 
const IMAGE_MODEL = "imagen-3.0-generate-001"; 

export const generateStoryStructure = async (settings: StorySettings): Promise<{ title: string; description: string; pages: Omit<StoryPage, 'imageUrl'>[] }> => {
  try {
    const prompt = `
      Write a children's story about "${settings.topic}".
      Genre: ${settings.genre}
      Age Group: ${settings.ageGroup}
      Art Style: ${settings.artStyle}
      Length: ${settings.pageCount} pages.
      
      For each page, provide the story text and a HIGHLY DETAILED image generation prompt that describes the scene visually, including the art style.
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the story" },
            description: { type: Type.STRING, description: "A brief summary of the story" },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  text: { type: Type.STRING, description: "The story text for this page" },
                  imagePrompt: { type: Type.STRING, description: "A detailed visual description for image generation" }
                },
                required: ["pageNumber", "text", "imagePrompt"]
              }
            }
          },
          required: ["title", "description", "pages"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini.");
    }

    const data = JSON.parse(response.text);
    return data;

  } catch (error: any) {
    console.error("Gemini Story Generation Error:", error);
    throw new Error(`Failed to generate story: ${error.message || error}`);
  }
};

export const generateIllustration = async (prompt: string, artStyle: string): Promise<string> => {
  try {
    // Constructing a prompt optimized for Imagen
    const finalPrompt = `${prompt}. Art Style: ${artStyle}. High quality, detailed, storybook illustration, 4k resolution.`;

    const response = await ai.models.generateImages({
        model: IMAGE_MODEL,
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64 = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64}`;
    }

    throw new Error("No image data returned.");

  } catch (error: any) {
    console.error("Gemini/Imagen Generation Error:", error);
    // Fallback strategy if Imagen quota is hit or specific model is unavailable
    // This ensures the user experience doesn't break during demos
    console.warn("Falling back to placeholder due to API error.");
    const seed = Math.floor(Math.random() * 100000);
    return `https://picsum.photos/seed/${seed}/1024/768`;
  }
};