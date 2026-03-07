const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    type: {
        type: String,
        enum: ['user', 'inquiry', 'booking', 'testimonial', 'inquiry_reply'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
