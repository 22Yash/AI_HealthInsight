// geminiAPI.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function analyzeTextWithGemini(text) {
  try {
    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(text);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error in geminiAPI.js:", error);
    throw error; // Re-throw the original error
  }
}

async function analyzeTextWithGeminiWithRetry(text, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await analyzeTextWithGemini(text); // Your existing Gemini API call
    } catch (error) {
      if (error.message.includes('429')) { // Check for 429 in the error message
        retries++;
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff (1s, 2s, 4s...)
        console.warn(`Gemini API rate limit exceeded. Retrying in ${delay}ms (attempt ${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Re-throw non-rate-limit errors
        throw error;
      }
    }
  }
  throw new Error(`Gemini API failed after ${maxRetries} retries due to rate limiting.`);
}

module.exports = { analyzeTextWithGeminiWithRetry }; // Export the retry function