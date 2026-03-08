require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("./models/Plan");
const Trainer = require("./models/Trainer");
const Admin = require("./models/Admin");

const plans = [
    {
        name: "Basic Plan",
        price: "999",
        duration: "/month",
        features: ["Gym Access", "Basic Workout Plan", "Locker Facility", "1 Trainer Support"],
        popular: false
    },
    {
        name: "Standard Plan",
        price: "1999",
        duration: "/month",
        features: ["Full Gym Access", "Personal Workout Plan", "Diet Guidance", "Cardio + Strength Training", "Trainer Support"],
        popular: true
    },
    {
        name: "Pro Plan",
        price: "2999",
        duration: "/month",
        features: ["Everything in Standard", "Personal Trainer", "Advanced Programs", "Body Transformation Plan", "Priority Support"],
        popular: false
    },
    {
        name: "Elite Plan",
        price: "4999",
        duration: "/month",
        features: ["All Pro Features", "1-on-1 Coaching", "Custom Diet Plan", "Supplement Guidance", "Premium Support"],
        popular: false
    }
];

const trainersData = [
    {
        name: "John Doe",
        specialty: "Bodybuilding",
        experience: "8 Years",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "Sarah Jenkins",
        specialty: "Yoga & Flexibility",
        experience: "5 Years",
        image: "https://images.unsplash.com/photo-1518611012118-2969c636022d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        name: "Mike Tyson",
        specialty: "Boxing & Cardio",
        experience: "12 Years",
        image: "https://images.unsplash.com/photo-1549476464-37392f71752a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
];

const seedData = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) return;

        console.log("Auto-Seeding Data to Atlas...");

        // 1. Seed Plans
        const planCount = await Plan.countDocuments();
        if (planCount === 0) {
            console.log("Seeding Plans...");
            await Plan.insertMany(plans);
            console.log("Plans Seeded! ✅");
        } else {
            console.log("Plans already exist. Skipping.");
        }

        // 2. Seed Trainers
        const trainerCount = await Trainer.countDocuments();
        if (trainerCount === 0) {
            console.log("Seeding Trainers...");
            await Trainer.insertMany(trainersData);
            console.log("Trainers Seeded! ✅");
        } else {
            console.log("Trainers already exist. Skipping.");
        }

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
        } else {
            console.log("Admin already exists. Skipping.");
        }

        console.log("Atlas Data Check Completed! ✅");
    } catch (error) {
        console.error("Seeding Error:", error);
    }
};

module.exports = seedData;
