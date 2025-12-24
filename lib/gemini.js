const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initializing the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates 5 project ideas based on user skills and GitHub trends.
 * As specified on Page 34 of the Development Guide.
 */
const generateProjectIdeas = async (userData, trends) => {
  // Precisely using the gemini-2.5-flash model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    User Profile:
    - Languages: ${userData.languages.join(', ')}
    - Frameworks: ${userData.frameworks.join(', ')}
    - Experience Level: ${userData.experience_level}

    GitHub Trending Context: ${trends}

    Task: Suggest 5 project ideas that are: challenging but achievable, portfolio-worthy, and incorporate modern practices.
    For each: title, description, tech stack, difficulty, and estimated time.
    Return ONLY a valid JSON array of objects. No markdown backticks or preamble.
    `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean and parse the AI response
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
};

/**
 * Explains repository architecture for a user.
 * As specified on Page 33 of the Development Guide.
 */
const explainArchitecture = async (repo, readme) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Explain this code architecture: ${repo.name}. README: ${readme}. 
    Focus on: what's happening, why these patterns, and how a developer can learn from this.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

/**
 * Generates a 3-month personalized learning roadmap.
 * As specified on Page 33 of the Development Guide.
 */
const generateRoadmap = async (topic) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `Create a 3-month roadmap for: ${topic}. 
    Include Month 1, Month 2, and Month 3 with specific topics and projects to build each month.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { generateProjectIdeas, explainArchitecture, generateRoadmap };