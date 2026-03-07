const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const Testimonial = require('../models/Testimonial');
const Trainer = require('../models/Trainer');
const Contact = require('../models/Contact');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fitness_club_secure_key_2024', {
        expiresIn: '30d',
    });
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin',
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid Admin Credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        console.log("Admin Stats API Called! Calculating dynamic metrics...");

        // 1. Total Members
        const totalUsers = await User.countDocuments({ role: 'user' });

        // 2. Dynamic Revenue Calculation & Monthly Breakdown
        const users = await User.find({ role: 'user' });
        let totalRevenue = 0;
        const monthlyRevenue = {};

        // Prepare last 6 months names (Reliably using 1st of each month to avoid day overflow)
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setDate(1); // Set to 1st to avoid skipping months
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('en-US', { month: 'short' });
            months.push(monthName);
            monthlyRevenue[monthName] = 0;
        }

        console.log("Debug: Prepared Months:", months);

        users.forEach(user => {
            if (user.bookedPlans && user.bookedPlans.length > 0) {
                user.bookedPlans.forEach(plan => {
                    totalRevenue += (plan.price || 0);

                    // Group by month for chart (Fallback to plan's created date if bookingDate missing)
                    const dateSource = plan.bookingDate || user.createdAt;
                    if (dateSource) {
                        const date = new Date(dateSource);
                        const mName = date.toLocaleString('en-US', { month: 'short' });
                        if (monthlyRevenue.hasOwnProperty(mName)) {
                            monthlyRevenue[mName] += (plan.price || 0);
                        }
                    }
                });
            }
        });

        // Convert monthlyRevenue object to array for frontend
        const chartData = months.map(m => ({
            month: m,
            revenue: monthlyRevenue[m] || 0
        }));

        console.log("Debug: Chart Data calculated:", chartData);

        // 3. New Inquiries (from Contacts collection)
        const newInquiries = await Contact.countDocuments({ status: 'unread' });

        // 4. Active Trainers (Now Dynamic)
        const activeTrainers = await Trainer.countDocuments({});

        console.log(`Stats Updated: Users: ${totalUsers}, Revenue: ${totalRevenue}`);

        res.json({
            totalUsers,
            totalRevenue,
            activeTrainers,
            newInquiries,
            chartData // Send real data to frontend
        });
    } catch (error) {
        console.error("Admin Stats Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getUserDetailsByAdmin = async (req, res) => {
    try {
        console.log(`[Admin Request] Fetching USER DETAILS for ID: ${req.params.id}`);
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            console.log(`[Admin Success] Sending data for user: ${user.name} (Progress entries: ${user.progress.length})`);
            res.json(user);
        } else {
            console.log(`[Admin Failure] User NOT found for ID: ${req.params.id}`);
            res.status(404).json({ message: 'User record not found in database.' });
        }
    } catch (error) {
        console.error("[Admin Error] getUserDetails Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const updateUserProgressByAdmin = async (req, res) => {
    try {
        console.log(`[Admin Progress Update] Incoming ID: ${req.params.id}, Body:`, req.body);
        const { weight, height } = req.body;
        const user = await User.findById(req.params.id);
        if (user) {
            user.progress.push({
                weight: parseFloat(weight),
                height: parseFloat(height),
                date: new Date()
            });
            await user.save();
            console.log(`[Admin Progress Success] Updated weights for user: ${user.name}`);
            res.json(user);
        } else {
            console.warn(`[Admin Progress Warning] User ID ${req.params.id} not found in database!`);
            res.status(404).json({ message: `User with ID ${req.params.id} not found.` });
        }
    } catch (error) {
        console.error(`[Admin Progress Error]`, error.message);
        res.status(500).json({ message: error.message });
    }
};

const assignWorkoutByAdmin = async (req, res) => {
    try {
        const { workoutName, repsSets, cardioSteps } = req.body;
        const user = await User.findById(req.params.id);
        if (user) {
            user.assignedWorkouts.push({ workoutName, repsSets, cardioSteps, date: new Date() });
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignSessionByAdmin = async (req, res) => {
    try {
        const { sessionName, time, coach } = req.body;
        const user = await User.findById(req.params.id);
        if (user) {
            user.assignedSessions.push({ sessionName, time, coach, date: new Date() });
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleAdminRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = user.role === 'admin' ? 'user' : 'admin';
            await user.save();
            res.json({ message: `User role updated to ${user.role}`, role: user.role });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminStats,
    adminLogin,
    getUserDetailsByAdmin,
    updateUserProgressByAdmin,
    assignWorkoutByAdmin,
    assignSessionByAdmin,
    toggleAdminRole
};
