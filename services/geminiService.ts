import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatModelMode } from "../types";

// Helper to get the correct model name based on mode
const getModelName = (mode: ChatModelMode): string => {
  // USAMOS "gemini-1.5-flash" PARA TODO PORQUE ES EL MÁS COMPATIBLE
  return 'gemini-1.5-flash';
};

const getThinkingConfig = (mode: ChatModelMode) => {
  if (mode === ChatModelMode.THINKING) {
    return {
      thinkingConfig: { thinkingBudget: 32768 }
    };
  }
  return {};
};

export const streamGeminiResponse = async (
  prompt: string,
  mode: ChatModelMode,
  history: { role: string; parts: { text: string }[] }[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  // CORRECCIÓN PARA VERCEL/VITE: Usamos import.meta.env
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please set VITE_API_KEY in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const modelName = getModelName(mode);
  
  // System instruction to guide the persona
  const systemInstruction = `Eres "Vistura", un asistente inmobiliario de élite para Vistura360. 
  Tu tono es profesional, sofisticado y servicial. 
  La plataforma se especializa en una estética "Dark Tech", tours inmersivos 4K y propiedades de alta gama tanto para renta como para venta.
  Si el usuario pregunta sobre comprar, vender o rentar, guíalo en consecuencia.
  Mantén las respuestas concisas a menos que estés en modo "Thinking" (Pensamiento), donde se requiere un razonamiento profundo.
  IMPORTANTE: Responde SIEMPRE en Español.`;

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction,
        ...getThinkingConfig(mode),
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
    });

    const result = await chat.sendMessageStream({ message: prompt });
    
    async function* generator() {
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    }

    return generator();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};