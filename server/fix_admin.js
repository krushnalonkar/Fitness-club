const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const fs = require('fs');

const logFile = 'update_log.txt';
const log = (msg) => {
    const time = new Date().toISOString();
    fs.appendFileSync(logFile, `${time} - ${msg}\n`);
    console.log(msg);
};

const updateAdmin = async () => {
    try {
        log('Starting update script...');
        const mongoURI = "mongodb+srv://lonkarkrushna1234_db_user:PTPNiTqoK0oXfjKi@gym-portal.rvnyotz.mongodb.net/GymPortal?retryWrites=true&w=majority&appName=GYM-Portal";
        
        log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        log('Connected! ✅');

        const emailToFind = 'admin@gym.com';
        const newEmail = 'admin@fitnessclub.com';
        const newPassword = 'AdminPassword123';

        log(`Searching for admin with email: ${emailToFind}`);
        let admin = await Admin.findOne({ email: emailToFind });

        if (!admin) {
            log('Admin with that email not found. Searching for any admin role...');
            admin = await Admin.findOne({ role: 'admin' });
        }

        if (admin) {
            log(`Found admin record: ${admin.email}. ID: ${admin._id}`);
            admin.email = newEmail;
            admin.password = newPassword;
            admin.name = 'Super Admin';
            await admin.save();
            log('Admin updated successfully in DB! 🚀');
        } else {
            log('No admin found. Creating a NEW admin record...');
            await Admin.create({
                name: 'Super Admin',
                email: newEmail,
                password: newPassword,
                role: 'admin'
            });
            log('New admin created! 🚀');
        }

        log('Verification check...');
        const verify = await Admin.findOne({ email: newEmail });
        if (verify) {
            log(`Verification SUCCESS: Admin email is now ${verify.email}`);
        } else {
            log('Verification FAILED: Could not find the updated/new admin.');
        }

        process.exit();
    } catch (error) {
        log(`CRITICAL ERROR: ${error.message}`);
        if (error.stack) log(error.stack);
        process.exit(1);
    }
};

updateAdmin();
