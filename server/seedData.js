require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("./models/Plan");
const Trainer = require("./models/Trainer");
const Admin = require("./models/Admin");

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

const trainersData = [
    {
        name: "Rahul Sharma",
        specialty: "Strength Coach",
        experience: "8+ Years",
        image: "/trainers/trainer1.png"
    },
    {
        name: "Amit Patil",
        specialty: "Personal Trainer",
        experience: "6+ Years",
        image: "/trainers/trainer2.png"
    },
    {
        name: "Sneha Fitness",
        specialty: "Cardio Specialist",
        experience: "5+ Years",
        image: "/trainers/trainer3.png"
    },
    {
        name: "Vikram Singh",
        specialty: "Bodybuilding Coach",
        experience: "7+ Years",
        image: "/trainers/trainer4.png"
    },
    {
        name: "Anjali Verma",
        specialty: "Fitness Trainer",
        experience: "4+ Years",
        image: "/trainers/trainer5.png"
    },
    {
        name: "Rohit Deshmukh",
        specialty: "Functional Trainer",
        experience: "5+ Years",
        image: "/trainers/trainer6.png"
    }
];

const seedData = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) return;

        console.log("Checking Initial Data in Atlas...");

        // 1. Seed Plans
        console.log("Refreshing Plans...");
        await Plan.deleteMany({});
        await Plan.insertMany(plans);
        console.log("Plans Restored! ✅");

        // 2. Seed Trainers
        console.log("Refreshing Trainers...");
        await Trainer.deleteMany({});
        await Trainer.insertMany(trainersData);
        console.log("Trainers Restored! ✅");

        // 3. Create Default Admin if not exists
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            console.log("Creating Default Admin Account...");
            await Admin.create({
                name: "Super Admin",
                email: "admin@gym.com",
                password: "admin123",
                role: "admin"
            });
            console.log("Default Admin Created! ✅ ID: admin@gym.com / Pass: admin123");
        }

        console.log("Atlas Data Sync Completed! ✅");
    } catch (error) {
        console.error("Seeding Error:", error);
    }
};

module.exports = seedData;
