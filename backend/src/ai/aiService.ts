import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIResult } from "../types/index.js";

export const processNoteWithAI = async (
  content: string
): Promise<AIResult> => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are an AI assistant for a notes app.

Generate JSON for this note:

{
"title":"",
"summary":"",
"tags":[]
}

Rules:
- Title max 8 words
- Summary 1 sentence
- 3 to 5 tags

Note:
${content}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned) as AIResult;
  } catch (error) {
    console.error("AI Error:", error);

    return {
      title: "Untitled Note",
      summary: "",
      tags: []
    };
  }
};
