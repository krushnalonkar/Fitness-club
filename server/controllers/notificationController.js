const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
    try {
        let query = { isRead: false };

        // 💡 SMART FILTERING:
        // 1. If Admin: Show only admin notifications (where user field is null/undefined)
        // 2. If User: Show only notifications intended for them (where user matches their ID)
        if (req.user.role === 'admin') {
            query.user = { $exists: false };
        } else {
            query.user = req.user._id;
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private/Admin
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.isRead = true;
            await notification.save();
            res.json({ message: 'Notification marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        let query = { isRead: false };

        if (req.user.role === 'admin') {
            query.user = { $exists: false };
        } else {
            query.user = req.user._id;
        }

        await Notification.updateMany(query, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
