const { GoogleGenerativeAI } = require("@google/generative-ai");

const generatePromptResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not set in environment." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // gemini-1.5-flash is not found for this key (404), so using 2.0-flash which is confirmed working.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const gymContextPrompt = `Role: Helpful GymPortal Assistant. Tone: Motivating/Short. 
Rules: Short answers (max 2 paragraphs). Subject: Fitness, Diet, GymPortal.
User: ${message}`;

        const result = await model.generateContent(gymContextPrompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ text: text });
    } catch (error) {
        console.error("Gemini API Error Status:", error.status);
        console.error("Gemini API Error Message:", error.message);

        let errorMsg = error.message;
        const statusCode = error.status || (error.response ? error.response.status : 500);

        if (statusCode === 429) {
            errorMsg = "AI is busy (Rate limit reached). Please wait a few seconds and try again.";
        } else if (statusCode === 404) {
            errorMsg = "AI Model not found or Key issues. Please check your API key.";
        } else if (error.message.includes("429")) {
            errorMsg = "AI is busy (Too many requests). Please wait a minute and try again.";
        }

        return res.status(statusCode).json({ error: errorMsg });
    }
}

module.exports = {
    generatePromptResponse
};
