const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('./models/Plan');

dotenv.config();

const plans = [
    {
        name: "Basic Plan",
        price: "₹999",
        duration: "/month",
        popular: false,
        features: [
            "Gym Access",
            "Basic Workout Plan",
            "Locker Facility",
            "1 Trainer Support",
        ],
    },
    {
        name: "Standard Plan",
        price: "₹1999",
        duration: "/month",
        popular: true,
        features: [
            "Full Gym Access",
            "Personal Workout Plan",
            "Diet Guidance",
            "Cardio + Strength Training",
            "Trainer Support",
        ],
    },
    {
        name: "Pro Plan",
        price: "₹2999",
        duration: "/month",
        popular: false,
        features: [
            "Everything in Standard",
            "Personal Trainer",
            "Advanced Programs",
            "Body Transformation Plan",
            "Priority Support",
        ],
    },
    {
        name: "Elite Plan",
        price: "₹4999",
        duration: "/month",
        popular: false,
        features: [
            "All Pro Features",
            "1-on-1 Coaching",
            "Custom Diet Plan",
            "Supplement Guidance",
            "Premium Support",
        ],
    },
];

const seedPlans = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/GymPortal";
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB for seeding plans... 🚀");

        // Clear existing plans to avoid duplicates
        await Plan.deleteMany();
        console.log("Cleared existing plans... 🧹");

        // Insert new plans
        await Plan.insertMany(plans);
        console.log("Initial plans seeded successfully! ✅");

        process.exit();
    } catch (error) {
        console.error("Error seeding plans:", error);
        process.exit(1);
    }
};

seedPlans();
