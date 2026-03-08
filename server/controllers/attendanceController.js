const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance for a user
// @route   POST /api/attendance
// @access  Private/Admin
const markAttendance = async (req, res) => {
    try {
        const { userId, date, status } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Normalize date to start of day to prevent multiple entries per day
        const startOfDay = new Date(date || Date.now());
        startOfDay.setHours(0, 0, 0, 0);

        // Check if already marked
        const existingRecord = await Attendance.findOne({
            user: userId,
            date: {
                $gte: startOfDay,
                $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingRecord) {
            existingRecord.status = status;
            await existingRecord.save();
            return res.json({ message: 'Attendance updated', attendance: existingRecord });
        }

        const attendance = await Attendance.create({
            user: userId,
            date: startOfDay,
            status,
            markedBy: req.user._id
        });

        res.status(201).json({ message: 'Attendance marked', attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance for a specific user
// @route   GET /api/attendance/user/:userId
// @access  Private
const getUserAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ user: req.params.userId }).sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all attendance for a specific date (for Admin)
// @route   GET /api/attendance/date/:date
// @access  Private/Admin
const getAttendanceByDate = async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('user', 'name email');

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    getUserAttendance,
    getAttendanceByDate
};
