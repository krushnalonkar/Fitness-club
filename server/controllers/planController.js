const Plan = require('../models/Plan');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new plan
// @route   POST /api/plans
// @access  Private/Admin
const addPlan = async (req, res) => {
    try {
        const { name, price, duration, features, popular } = req.body;
        const plan = await Plan.create({
            name,
            price,
            duration,
            features,
            popular
        });
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (plan) {
            plan.name = req.body.name || plan.name;
            plan.price = req.body.price || plan.price;
            plan.duration = req.body.duration || plan.duration;
            plan.features = req.body.features || plan.features;
            plan.popular = req.body.popular !== undefined ? req.body.popular : plan.popular;

            const updatedPlan = await plan.save();
            res.json(updatedPlan);
        } else {
            res.status(404).json({ message: 'Plan not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (plan) {
            await plan.deleteOne();
            res.json({ message: 'Plan removed' });
        } else {
            res.status(404).json({ message: 'Plan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPlans,
    addPlan,
    updatePlan,
    deletePlan
};
