const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB... ✅');

        const admins = await Admin.find({});
        console.log('\n--- CURRENT ADMINS IN DATABASE ---');
        admins.forEach(admin => {
            console.log(`ID: ${admin._id}`);
            console.log(`Name: ${admin.name}`);
            console.log(`Email: ${admin.email}`);
            console.log(`Role: ${admin.role}`);
            console.log('-----------------------------');
        });

        if (admins.length === 0) {
            console.log('No admins found in the "Admin" collection.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkAdmins();
