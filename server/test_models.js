require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const listModels = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        // There isn't a direct listModels in the SDK easily without discovery service
        // but typically 404 means the model string is wrong or the key doesn't have access.

        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        for (const m of models) {
            try {
                console.log(`Testing model: ${m}`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                console.log(`SUCCESS with ${m}:`, (await result.response).text());
                break;
            } catch (e) {
                console.log(`FAILED with ${m}: ${e.message}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

listModels();
