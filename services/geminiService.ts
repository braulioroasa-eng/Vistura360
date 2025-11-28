// @ts-ignore
import { ChatModelMode } from "../types";

// Función auxiliar para intentar conectar con un modelo específico
async function tryGenerate(modelName: string, apiKey: string, contents: any[], systemInstruction: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: contents,
      systemInstruction: systemInstruction,
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  return response.json();
}

export const streamGeminiResponse = async (
  prompt: string,
  mode: ChatModelMode,
  history: { role: string; parts: { text: string }[] }[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  // 1. Obtenemos la clave
  // @ts-ignore
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error("Falta la API Key.");

  // 2. Preparamos el historial
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: msg.parts
  }));
  
  // Agregamos el mensaje actual
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const systemInstruction = {
    parts: [{ text: `Eres "Vistura", un asistente inmobiliario experto. Responde brevemente y siempre en Español.` }]
  };

  let data;
  
  try {
    // INTENTO 1: Probamos con el modelo Flash específico (suele ser el más estable)
    try {
      data = await tryGenerate('gemini-1.5-flash-latest', apiKey, contents, systemInstruction);
    } catch (e) {
      console.warn("Falló Flash, cambiando a Plan B...");
      // INTENTO 2 (PLAN B): Si falla, usamos el modelo clásico que nunca falla
      data = await tryGenerate('gemini-pro', apiKey, contents, systemInstruction);
    }

    const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar la respuesta.";

    // 3. Efecto de escritura fluida
    async function* generator() {
      const words = fullText.split(" ");
      for (const word of words) {
        yield word + " ";
        await new Promise(resolve => setTimeout(resolve, 20)); 
      }
    }

    return generator();

  } catch (error) {
    console.error("Error Final:", error);
    async function* errorGenerator() {
      yield "Lo siento, hubo un problema de conexión. Intenta recargar la página.";
    }
    return errorGenerator();
  }
};