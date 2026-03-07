const express = require('express');
const router = express.Router();

console.log("[Router Diagnostic] Admin Routes Initializing... checking endpoints: member-profile, member-actions, ping.");
const {
    getAdminStats,
    adminLogin,
    getUserDetailsByAdmin,
    updateUserProgressByAdmin,
    assignWorkoutByAdmin,
    assignSessionByAdmin
} = require('../controllers/adminController');
const { deleteUserPlan, cancelUserPlan } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// NEW: Robust route for admin view of user details (TOP PRIORITY)
router.get('/member-profile/:id', protect, getUserDetailsByAdmin);

// NEW: Fitness & Progress Management
router.post('/member-actions/:id/progress', protect, updateUserProgressByAdmin);
router.post('/member-actions/:id/workout', protect, assignWorkoutByAdmin);
router.post('/member-actions/:id/session', protect, assignSessionByAdmin);

// Membership Management (Admin Only)
router.put('/member-actions/:id/plans/:planId/cancel', protect, cancelUserPlan);
router.delete('/member-actions/:id/plans/:planId', protect, deleteUserPlan);

// Public route for admin login
router.post('/login', adminLogin);

// Route for admin stats
router.get('/stats', getAdminStats);

// Diagnostic Route
router.get('/ping', (req, res) => res.json({ message: "Admin API is REACHABLE! ✅" }));

module.exports = router;
