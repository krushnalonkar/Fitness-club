const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/GymPortal");

        const adminExists = await Admin.findOne({ email: 'admin@fitnessclub.com' });

        if (adminExists) {
            console.log('Admin account already exists! ✅');
            process.exit();
        }

        const admin = await Admin.create({
            name: 'Master Admin',
            email: 'admin@fitnessclub.com',
            password: 'AdminPassword123'
        });

        if (admin) {
            console.log('ADMIN ACCOUNT CREATED SUCCESSFULLY (IN NEW ADMIN SCHEMA)! 🚀');
            console.log('Email: admin@fitnessclub.com');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
