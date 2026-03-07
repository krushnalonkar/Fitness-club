const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    duration: { type: String, required: true },
    features: { type: [String], required: true },
    popular: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
