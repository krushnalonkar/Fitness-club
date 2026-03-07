const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_6pG8AasXwVn53F', // Placeholder keys
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'DummySecretKey'
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { amount, planId } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const options = {
            amount: Number(amount * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planDetails,
            userId
        } = req.body;

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'DummySecretKey')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is valid, now we can update the user's plan in database
            const user = await User.findById(userId || req.user._id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Add the plan to user's bookedPlans
            user.bookedPlans.push({
                planName: planDetails.name,
                price: planDetails.price,
                duration: planDetails.duration,
                bookingDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days, adjust based on plan
                status: 'active'
            });

            await user.save();

            res.status(200).json({
                success: true,
                message: 'Payment verified and plan activated!'
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
};
