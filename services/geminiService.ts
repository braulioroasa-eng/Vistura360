// @ts-ignore
import { GoogleGenAI } from "@google/genai";
import { ChatModelMode } from "../types";

// Usamos el modelo Flash que es el más rápido y estable
const getModelName = (mode: ChatModelMode): string => {
  return 'gemini-1.5-flash';
};

export const streamGeminiResponse = async (
  prompt: string,
  mode: ChatModelMode,
  history: { role: string; parts: { text: string }[] }[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  // @ts-ignore
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error("Falta la API Key. Asegúrate de poner VITE_API_KEY en Vercel.");
  }

  // Configuración para usar la versión Beta (evita el error 404)
  const ai = new GoogleGenAI({ 
    apiKey: apiKey
  });

  const modelName = getModelName(mode);
  
  const systemInstruction = `Eres "Vistura", un asistente inmobiliario de élite para Vistura360. 
  Tu tono es profesional y servicial. Responde SIEMPRE en Español.`;

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
    });

    const result = await chat.sendMessageStream({ message: prompt });
    
    async function* generator() {
      // @ts-ignore
      for await (const chunk of result) {
        // @ts-ignore
        const text = chunk.text; 
        if (text) {
          yield text;
        }
      }
    }

    return generator();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};