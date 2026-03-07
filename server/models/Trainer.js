const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    experience: {
        type: String, // e.g., "5 Years"
        required: true
    },
    image: {
        type: String, // URL to image
        default: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Trainer', trainerSchema);
