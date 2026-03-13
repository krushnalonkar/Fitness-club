const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const updateAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected! ✅');

        const newEmail = 'admin@fitnessclub.com';
        const newPassword = 'AdminPassword123';

        // 1. Try to find the admin by the email shown in your screenshot
        let admin = await Admin.findOne({ email: 'admin@gym.com' });

        if (!admin) {
            // 2. If not found, try to find ANY admin
            admin = await Admin.findOne({ role: 'admin' });
        }

        if (admin) {
            console.log(`Found admin: ${admin.email}. Updating...`);
            admin.email = newEmail;
            admin.password = newPassword; // This will be hashed by the pre-save hook in Admin.js
            admin.name = 'Master Admin';
            await admin.save();
            console.log('\n--- ADMIN UPDATED SUCCESSFULLY ---');
            console.log(`New Email: ${newEmail}`);
            console.log(`New Password: ${newPassword}`);
            console.log('----------------------------------\n');
        } else {
            console.log('No admin found to update. Creating a NEW one...');
            await Admin.create({
                name: 'Master Admin',
                email: newEmail,
                password: newPassword,
                role: 'admin'
            });
            console.log('\n--- NEW ADMIN CREATED ---');
            console.log(`Email: ${newEmail}`);
            console.log(`Password: ${newPassword}`);
            console.log('--------------------------\n');
        }

        process.exit();
    } catch (error) {
        console.error('Error updating admin:', error.message);
        process.exit(1);
    }
};

updateAdmin();
