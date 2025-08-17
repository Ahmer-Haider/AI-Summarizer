import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// ✅ TO THIS LINE:
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/**
 * Generates a summary using the provided text and prompt.
 * @param {string} text - The content to be summarized.
 * @param {string} prompt - The instruction for the AI.
 * @returns {Promise<string>} The generated summary.
 */
export const generateSummary = async (text, prompt) => {
    const fullPrompt = `${prompt}:\n\nContent:\n${text}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
};