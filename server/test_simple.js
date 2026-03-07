const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const test = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        // Let's test with a model we SAW in the list
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("Generated model instance. Sending prompt...");
        const result = await model.generateContent("Hi");
        console.log("Response:", result.response.text());
    } catch (err) {
        console.error("ERROR TYPE:", err.constructor.name);
        console.error("ERROR MSG:", err.message);
        if (err.status) console.error("STATUS:", err.status);
    }
};

test();
