import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export const generateSummary = async (text, prompt) => {
    const fullPrompt = `${prompt}:\n\nContent:\n${text}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
};