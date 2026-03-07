const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get user profile/dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getUserDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                bookedPlans: user.bookedPlans,
                progress: user.progress,
                assignedWorkouts: user.assignedWorkouts,
                assignedSessions: user.assignedSessions,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user progress
// @route   POST /api/users/progress
// @access  Private
const updateUserProgress = async (req, res) => {
    try {
        const { weight, height } = req.body;

        if (!weight && !height) {
            return res.status(400).json({ message: 'Please provide weight or height to update' });
        }

        const user = await User.findById(req.user._id);

        if (user) {
            user.progress.push({
                weight: weight || user.progress[user.progress.length - 1]?.weight,
                height: height || user.progress[user.progress.length - 1]?.height,
            });

            const updatedUser = await user.save();
            res.json(updatedUser.progress);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            // Handle height/weight updates
            if (req.body.height || req.body.weight) {
                const latest = user.progress.length > 0 ? user.progress[user.progress.length - 1] : {};
                user.progress.push({
                    height: req.body.height ? parseFloat(req.body.height) : latest.height,
                    weight: req.body.weight ? parseFloat(req.body.weight) : latest.weight,
                    date: Date.now()
                });
            }

            if (req.body.password) {
                if (!req.body.currentPassword) {
                    return res.status(400).json({ message: 'Current password is required to change password' });
                }
                const isMatch = await user.matchPassword(req.body.currentPassword);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Incorrect current password' });
                }
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                bookedPlans: updatedUser.bookedPlans,
                progress: updatedUser.progress,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookPlan = async (req, res) => {
    try {
        const { planName, price, duration } = req.body;

        if (!planName || !price || !duration) {
            return res.status(400).json({ message: 'Please provide all plan details (planName, price, duration)' });
        }

        const user = await User.findById(req.user._id);

        if (user) {
            // Check if user already has an active plan
            const hasActivePlan = user.bookedPlans.some(p => {
                if (!p.endDate || p.status === 'cancelled') return false;
                return new Date(p.endDate) > new Date();
            });

            if (hasActivePlan) {
                return res.status(400).json({ message: 'You already have an active plan. You cannot book another plan until your current plan expires.' });
            }

            // Calculate endDate (1 month from now)
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            // Assign a random trainer
            const availableTrainers = [
                "Rahul Sharma", "Amit Patil", "Sneha Fitness", "Vikram Singh", "Anjali Verma", "Rohit Deshmukh"
            ];
            const randomTrainerIndex = Math.floor(Math.random() * availableTrainers.length);
            const assignedTrainer = availableTrainers[randomTrainerIndex];

            const priceNum = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;

            const newPlan = {
                planName,
                price: priceNum,
                duration,
                orderId: `PAY-${Math.floor(Math.random() * 900000 + 100000)}`,
                paymentStatus: 'completed',
                status: 'active',
                bookingDate: startDate,
                endDate: endDate,
                assignedTrainer: assignedTrainer
            };

            user.bookedPlans.push(newPlan);
            const updatedUser = await user.save();

            // Create Admin Notification
            await Notification.create({
                message: `Plan Booked: ${user.name} purchased ${planName}!`,
                type: 'booking'
            });

            res.json(updatedUser.bookedPlans);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin logic
const getUsers = async (req, res) => {
    try {
        // Fetch users where role is NOT 'admin'
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        console.log(`Debug: Found ${users.length} users in database.`);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin logic
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin logic
const createUserByAdmin = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or phone' });
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: role || 'user'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin logic
const updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.role = req.body.role || user.role;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Delete a user's specific booked plan
// @route   DELETE /api/users/:userId/plans/:planId
const deleteUserPlan = async (req, res) => {
    try {
        const { userId, planId } = req.params;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const planToDelete = user.bookedPlans.find(p => p._id.toString() === planId);
        const planName = planToDelete ? planToDelete.planName : "membership";

        user.bookedPlans = user.bookedPlans.filter(p => p._id.toString() !== planId);
        await user.save();

        // Notify User
        await Notification.create({
            message: `Your ${planName} membership has been removed from the records by the administrator. Contact support for details.`,
            user: userId,
            type: 'user'
        });

        res.json({ message: 'Plan record deleted and user notified', bookedPlans: user.bookedPlans });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin: Cancel a user's membership
// @route   PUT /api/users/:userId/plans/:planId/cancel
const cancelUserPlan = async (req, res) => {
    try {
        const { userId, planId } = req.params;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const plan = user.bookedPlans.find(p => p._id.toString() === planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        plan.status = 'cancelled';
        await user.save();

        // Notify User
        await Notification.create({
            message: `IMPORTANT: Your active membership ${plan.planName} has been CANCELLED by the administrator. Facility access is now restricted.`,
            user: userId,
            type: 'user'
        });

        res.json({ message: 'Membership cancelled and user notified', bookedPlans: user.bookedPlans });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserDashboard,
    updateUserProgress,
    updateUserProfile,
    bookPlan,
    getUsers,
    deleteUser,
    updateUserByAdmin,
    createUserByAdmin,
    deleteUserPlan,
    cancelUserPlan
};
