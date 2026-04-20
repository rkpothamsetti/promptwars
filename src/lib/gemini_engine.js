/**
 * Gemini Intelligence Engine for SmartStadium OS
 * Handles proactive suggestions and natural language interactions.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Gets proactive advice from Gemini API based on persona and stadium data.
 * @param {Object} persona - The active persona (FAN, FAMILY, STAFF).
 * @param {Array} stadiumData - The current stadium metrics.
 * @returns {Promise<Object>} An object containing message and action.
 */
export const getGeminiAdvice = async (persona, stadiumData) => {
  const highTrafficArea = stadiumData.find(d => d.status === 'HIGH');
  const fastestGate = stadiumData
    .filter(d => d.type === 'gate')
    .sort((a, b) => a.waitTime - b.waitTime)[0];

  const prompts = {
    FAN: `You are an AI assistant for a cricket stadium. The user is a Die-Hard Fan. Fastest concession wait time is for ${stadiumData.find(d => d.type === 'concession')?.name}. Give a short 1-2 sentence tip.`,
    FAMILY: `You are an AI assistant for a cricket stadium. The user is with a Family Group. They want low congestion. Fastest gate is ${fastestGate?.name}. Give a short 1-2 sentence tip.`,
    STAFF: `You are an AI assistant for a cricket stadium. The user is Ground Staff. The area ${highTrafficArea?.name || 'none'} is experiencing high traffic. Give a short 1-2 sentence operational alert.`
  };

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompts[persona.id]);
      const response = await result.response;
      return { message: response.text(), action: 'AI_SUGGESTION' };
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fall through to fallback
    }
  }

  // Fallback Logic if API Key is missing or request fails
  await new Promise(r => setTimeout(r, 500));

  if (persona.id === 'FAN') {
    return {
      message: `The match is heating up! If you're planning a snack run, head to ${stadiumData.find(d => d.type === 'concession' && d.status !== 'HIGH')?.name || 'the back stands'} now. Wait times are currently under 5 minutes.`,
      action: 'PRE_ORDER'
    };
  }

  if (persona.id === 'FAMILY') {
    return {
      message: `Crowds are gathering near North Pavilion. I've found a quieter route to the restrooms near West Stand for your group.`,
      action: 'NAVIGATE'
    };
  }

  return {
    message: `CRITICAL: ${highTrafficArea?.name || 'Entry Gates'} seeing sudden influx. Recommend opening Gate B overflow lane and redeploying 3 staff members.`,
    action: 'DEPLOY'
  };
};
