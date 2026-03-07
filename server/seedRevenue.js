const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedRevenue = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/GymPortal");

        // Find an existing user or create a "Test Member"
        let user = await User.findOne({ email: 'testmember@gmail.com' });
        if (!user) {
            user = await User.create({
                name: "Test Member",
                email: "testmember@gmail.com",
                password: "password123",
                role: "user"
            });
        }

        // Add bookings for last 6 months
        const monthsData = [
            { monthOffset: 5, price: 4500 },
            { monthOffset: 4, price: 5200 },
            { monthOffset: 3, price: 4800 },
            { monthOffset: 2, price: 6100 },
            { monthOffset: 1, price: 5800 },
            { monthOffset: 0, price: 7500 }
        ];

        user.bookedPlans = []; // Clear existing for clean test

        monthsData.forEach(data => {
            const date = new Date();
            date.setMonth(date.getMonth() - data.monthOffset);

            user.bookedPlans.push({
                planName: "Elite Fitness Plan",
                price: data.price,
                duration: "1 Month",
                bookingDate: date,
                endDate: new Date(date).setMonth(date.getMonth() + 1),
                assignedTrainer: "Rahul Sharma"
            });
        });

        await user.save();
        console.log('✅ Mock Revenue Data Seeded for Test Member!');
        process.exit();
    } catch (error) {
        console.error('Error seeding revenue:', error);
        process.exit(1);
    }
};

seedRevenue();
