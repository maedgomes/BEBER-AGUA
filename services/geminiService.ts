import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHydrationAdvice = async (currentIntake: number, goal: number): Promise<string> => {
  try {
    const percentage = Math.round((currentIntake / goal) * 100);
    
    const prompt = `
      Você é um coach de saúde amigável e motivador focado em hidratação.
      O usuário bebeu ${currentIntake}ml hoje, o que representa ${percentage}% da meta diária de ${goal}ml.
      
      Forneça uma frase curta (máximo 20 palavras) em Português do Brasil.
      Se a porcentagem for baixa, motive a beber mais.
      Se estiver perto da meta, parabenize.
      Se passou da meta, elogie o bom trabalho mas lembre de não exagerar.
      Pode incluir um emoji.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Mantenha-se hidratado! 💧";
  } catch (error) {
    console.error("Error fetching hydration advice:", error);
    return "A água é essencial para a vida. Beba um pouco agora! 💧";
  }
};