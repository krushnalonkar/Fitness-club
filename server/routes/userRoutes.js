
const express = require('express');
const router = express.Router();
const { getUserDashboard, updateUserProgress, updateUserProfile, bookPlan, getUsers, deleteUser, updateUserByAdmin, createUserByAdmin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getUserDashboard);
router.post('/progress', protect, updateUserProgress);
router.put('/profile', protect, updateUserProfile);
router.post('/book-plan', protect, bookPlan);

// Admin Management Routes
router.get('/', getUsers);
router.post('/', protect, createUserByAdmin);
router.put('/:id', protect, updateUserByAdmin);
router.delete('/:id', protect, deleteUser);

module.exports = router;
