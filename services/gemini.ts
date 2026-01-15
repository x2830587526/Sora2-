import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ScriptResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateScript = async (plotIdea: string): Promise<ScriptResponse> => {
  const ai = getClient();
  
  const modelId = "gemini-3-flash-preview"; 

  const prompt = `Generate an anime script and structured Sora prompt for the following plot idea: "${plotIdea}"`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storyboard: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  camera: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["time", "camera", "action"]
              }
            },
            character: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                dialogue: { type: Type.STRING }
              },
              required: ["description", "dialogue"]
            },
            soraPrompt: {
              type: Type.OBJECT,
              properties: {
                project_title: { type: Type.STRING },
                format: { type: Type.STRING },
                style: { type: Type.STRING },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      scene_id: { type: Type.STRING },
                      location: { type: Type.STRING },
                      time: { type: Type.STRING },
                      visual_description: { type: Type.STRING },
                      camera_movement: { type: Type.STRING },
                      action: { type: Type.STRING },
                      dialogue: { type: Type.STRING },
                      duration: { type: Type.STRING }
                    },
                    required: ["scene_id", "location", "time", "visual_description", "camera_movement", "action", "duration"]
                  }
                }
              },
              required: ["project_title", "format", "style", "scenes"]
            }
          },
          required: ["storyboard", "character", "soraPrompt"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    return JSON.parse(text) as ScriptResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};