const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

/**
 * Initialize Gemini AI client lazily on first use.
 * Uses gemini-1.5-flash: fast, capable, free tier available.
 */
const getGeminiModel = () => {
  if (model) return model;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Please add it to your .env file.\n' +
      'Get a free key at: https://aistudio.google.com/app/apikey'
    );
  }

  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,          // Lower = more consistent/analytical
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  });

  console.log('✅ Gemini AI initialized (gemini-1.5-flash)');
  return model;
};

module.exports = { getGeminiModel };