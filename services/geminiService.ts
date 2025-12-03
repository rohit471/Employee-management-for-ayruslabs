import { GoogleGenAI } from "@google/genai";
import { TaskPriority, TaskStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTaskDetails = async (title: string) => {
  try {
    const prompt = `
      I am a project manager creating a task for a software engineering team.
      The task title is: "${title}".
      
      Please generate a concise but professional description for this task (max 2 sentences).
      Also suggest a Priority (Low, Medium, or High) based on the complexity implied by the title.
      
      Return the response in pure JSON format with keys: "description" and "priority".
      Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as { description: string, priority: string };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};