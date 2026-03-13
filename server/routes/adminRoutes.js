const express = require('express');
const router = express.Router();

console.log("[Router Diagnostic] Admin Routes Initializing... checking endpoints: member-profile, member-actions, ping.");
const {
    getAdminStats,
    adminLogin,
    getUserDetailsByAdmin,
    updateUserProgressByAdmin,
    assignWorkoutByAdmin,
    assignSessionByAdmin,
    toggleAdminRole
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
router.put('/member-actions/:id/toggle-admin', protect, toggleAdminRole);

// Public route for admin login
router.post('/login', adminLogin);

// Route for admin stats
router.get('/stats', getAdminStats);

// 🛠️ TEMPORARY RECOVERY ROUTE (Remove after use)
router.get('/fix-admin-recovery', async (req, res) => {
    try {
        const Admin = require('../models/Admin');
        const newEmail = 'admin@fitnessclub.com';
        const newPassword = 'AdminPassword123';
        
        let admin = await Admin.findOne({ email: 'admin@gym.com' });
        if (!admin) admin = await Admin.findOne({ role: 'admin' });
        
        if (admin) {
            admin.email = newEmail;
            admin.password = newPassword;
            admin.name = 'Super Admin';
            await admin.save();
            return res.json({ message: "Admin Updated Successfully! ✅", email: newEmail, password: newPassword });
        } else {
            await Admin.create({
                name: 'Super Admin',
                email: newEmail,
                password: newPassword,
                role: 'admin'
            });
            return res.json({ message: "New Admin Created! 🚀", email: newEmail, password: newPassword });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Diagnostic Route
router.get('/ping', (req, res) => res.json({ message: "Admin API is REACHABLE! ✅" }));

module.exports = router;
