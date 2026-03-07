const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    bookedPlans: [{
        planName: String,
        price: Number,
        duration: String,
        orderId: String, // To track transactions
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'completed'
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired'],
            default: 'active'
        },
        bookingDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        },
        assignedTrainer: {
            type: String
        }
    }],
    progress: [{
        weight: Number,
        height: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
