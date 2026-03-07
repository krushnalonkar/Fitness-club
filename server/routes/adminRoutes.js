const express = require('express');
const router = express.Router();
const { getAdminStats, adminLogin, getUserDetailsByAdmin } = require('../controllers/adminController');
const { deleteUserPlan, cancelUserPlan } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// NEW: Robust route for admin view of user details (TOP PRIORITY)
router.get('/member-profile/:id', protect, getUserDetailsByAdmin);

// Membership Management (Admin Only)
router.put('/member-actions/:userId/plans/:planId/cancel', protect, cancelUserPlan);
router.delete('/member-actions/:userId/plans/:planId', protect, deleteUserPlan);

// Public route for admin login
router.post('/login', adminLogin);

// Route for admin stats
router.get('/stats', getAdminStats);

// Diagnostic Route
router.get('/ping', (req, res) => res.json({ message: "Admin API is REACHABLE! ✅" }));

module.exports = router;
