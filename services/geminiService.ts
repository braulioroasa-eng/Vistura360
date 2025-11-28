// @ts-ignore
import { ChatModelMode } from "../types";

export const streamGeminiResponse = async (
  prompt: string,
  mode: ChatModelMode,
  history: { role: string; parts: { text: string }[] }[]
): Promise<AsyncGenerator<string, void, unknown>> => {
  
  // 1. Obtenemos la clave de forma segura
  // @ts-ignore
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) throw new Error("Falta la API Key. Verifica Vercel.");

  // 2. Preparamos los mensajes para Google
  // Convertimos el historial al formato que pide la API REST
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: msg.parts
  }));
  
  // Agregamos la pregunta actual del usuario
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const systemInstruction = {
    parts: [{ text: `Eres "Vistura", un asistente inmobiliario de élite. 
    Tu tono es profesional y servicial. Responde SIEMPRE en Español. 
    Sé conciso.` }]
  };

  try {
    // 3. CONEXIÓN DIRECTA (Sin librerías que fallen)
    // Usamos el endpoint REST oficial que nunca falla
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: systemInstruction,
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de Google: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 4. GENERADOR (Simulamos el efecto de escritura)
    // Esto hace que el chat no se vea "de golpe", sino fluido.
    async function* generator() {
      const words = fullText.split(" ");
      for (const word of words) {
        yield word + " ";
        // Pequeña pausa para efecto visual
        await new Promise(resolve => setTimeout(resolve, 30)); 
      }
    }

    return generator();

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Mensaje de error amigable para el chat
    async function* errorGenerator() {
      yield "Lo siento, hubo un error de conexión. Por favor intenta de nuevo.";
    }
    return errorGenerator();
  }
};