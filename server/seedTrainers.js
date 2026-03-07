const mongoose = require('mongoose');
const Trainer = require('./models/Trainer');
const dotenv = require('dotenv');

dotenv.config();

const trainers = [
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

const seedTrainers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/GymPortal");

        await Trainer.deleteMany();
        console.log('Old trainers cleared');

        await Trainer.insertMany(trainers);
        console.log('Local Trainers Seeded Successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding trainers:', error);
        process.exit(1);
    }
};

seedTrainers();
