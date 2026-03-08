const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getUserAttendance,
    getAttendanceByDate
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, markAttendance);
router.get('/user/:userId', protect, getUserAttendance);
router.get('/date/:date', protect, getAttendanceByDate);

module.exports = router;
