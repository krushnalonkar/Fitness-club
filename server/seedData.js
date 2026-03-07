require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("./models/Plan");
const Trainer = require("./models/Trainer");

const plans = [
    {
        name: "Basic Plan",
        price: "₹999",
        duration: "/month",
        features: ["Gym Access", "Basic Workout Plan", "Locker Facility", "1 Trainer Support"],
        popular: false
    },
    {
        name: "Standard Plan",
        price: "₹1999",
        duration: "/month",
        features: ["Full Gym Access", "Personal Workout Plan", "Diet Guidance", "Cardio + Strength Training", "Trainer Support"],
        popular: true
    },
    {
        name: "Pro Plan",
        price: "₹2999",
        duration: "/month",
        features: ["Everything in Standard", "Personal Trainer", "Advanced Programs", "Body Transformation Plan", "Priority Support"],
        popular: false
    },
    {
        name: "Elite Plan",
        price: "₹4999",
        duration: "/month",
        features: ["All Pro Features", "1-on-1 Coaching", "Custom Diet Plan", "Supplement Guidance", "Premium Support"],
        popular: false
    }
];

const trainers = [
    {
        name: "John Doe",
        specialization: "Bodybuilding",
        experience: "8 Years",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "Sarah Jenkins",
        specialization: "Yoga & Flexibility",
        experience: "5 Years",
        image: "https://images.unsplash.com/photo-1518611012118-2969c636022d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "Mike Tyson",
        specialization: "Boxing & Cardio",
        experience: "12 Years",
        image: "https://images.unsplash.com/photo-1549476464-37392f71752a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
];

const seedData = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) return;

        console.log("Auto-Seeding Data to Atlas...");

        // Remove existing and add original plans
        await Plan.deleteMany({});
        await Plan.insertMany(plans);

        // Ensure trainers are also present
        const trainerCount = await Trainer.countDocuments();
        if (trainerCount === 0) {
            await Trainer.insertMany(trainers);
        }

        console.log("Atlas Data Synced Successfully! ✅");
    } catch (error) {
        console.error("Seeding Error:", error);
    }
};

module.exports = seedData;
