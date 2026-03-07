require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const testChat = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Using API Key:", apiKey ? "Present" : "Missing");

        if (!apiKey) {
            console.error("No API key found!");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        console.log("Sending request to Gemini...");
        const result = await model.generateContent("Say hello!");
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Response:", text);
    } catch (error) {
        console.error("DETAILED ERROR:", error);
        if (error.response) {
            console.error("RESPONSE DATA:", error.response.data);
        }
    }
};

testChat();
