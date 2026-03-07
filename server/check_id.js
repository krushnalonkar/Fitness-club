const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/GymPortal";

mongoose.connect(mongoURI).then(async () => {
    const id = "69aac4f4da833df1551c3fc2";
    console.log(`Searching for User with ID: ${id}`);
    try {
        const user = await User.findById(id);
        if (user) {
            console.log(`FOUND User: ${user.name} (${user.email})`);
        } else {
            console.log(`NOT FOUND: User with ID ${id} does not exist in collection.`);
            const anyUser = await User.findOne();
            if (anyUser) {
                console.log(`Example ID in DB: ${anyUser._id}`);
            }
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
    process.exit();
});
