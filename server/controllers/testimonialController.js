const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

// @desc    Add a testimonial
// @route   POST /api/testimonials
// @access  Private
const addTestimonial = async (req, res) => {
    try {
        const { feedback, rating } = req.body;

        if (!feedback || !rating) {
            return res.status(400).json({ message: 'Please provide feedback and rating' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Determine role based on active plans
        let userRole = 'Gym Member';
        if (user.bookedPlans && user.bookedPlans.length > 0) {
            const activePlan = user.bookedPlans.find(p => !p.endDate || new Date(p.endDate) > new Date());
            if (activePlan) {
                userRole = `${activePlan.planName} Member`;
            }
        }

        const testimonial = new Testimonial({
            user: req.user._id,
            name: user.name,
            role: userRole,
            feedback,
            rating: Number(rating)
        });

        const createdTestimonial = await testimonial.save();
        res.status(201).json(createdTestimonial);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public (for site) / Admin (for manage)
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        console.log(`Debug: Found ${testimonials.length} testimonials in database.`);
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) {
            await Testimonial.deleteOne({ _id: req.params.id });
            res.json({ message: 'Testimonial removed' });
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addTestimonial, getTestimonials, deleteTestimonial };
