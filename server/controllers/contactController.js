const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const inquiry = await Contact.create({
            name,
            email,
            subject,
            message
        });

        // Create Admin Notification with refId
        await Notification.create({
            message: `New Inquiry from ${name}: ${subject}`,
            type: 'inquiry',
            refId: inquiry._id
        });

        res.status(201).json({ message: 'Inquiry sent successfully', inquiry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/contacts
// @access  Private/Admin
const getInquiries = async (req, res) => {
    try {
        const inquiries = await Contact.find({}).sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark inquiry as read
// @route   PUT /api/contacts/:id/read
// @access  Private/Admin
const markInquiryRead = async (req, res) => {
    try {
        const inquiry = await Contact.findById(req.params.id);
        if (inquiry) {
            inquiry.status = 'read';
            await inquiry.save();

            // 💡 Mark the corresponding notification as read too!
            await Notification.updateMany(
                { refId: inquiry._id, type: 'inquiry' },
                { isRead: true }
            );

            res.json({ message: 'Inquiry and notification marked as read' });
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendEmail = require('../utils/sendEmail');

// @desc    Reply to inquiry
// @route   PUT /api/contacts/:id/reply
// @access  Private/Admin
const replyToInquiry = async (req, res) => {
    try {
        const { reply } = req.body;
        const inquiry = await Contact.findById(req.params.id);

        if (inquiry) {
            inquiry.adminReply = reply;
            inquiry.status = 'replied';
            inquiry.repliedAt = Date.now();
            await inquiry.save();

            // 💡 Mark corresponding notification as read too!
            await Notification.updateMany(
                { refId: inquiry._id, type: 'inquiry' },
                { isRead: true }
            );

            // 💡 SMART LOGIC: Check if this email belongs to a registered member
            const registeredUser = await User.findOne({ email: inquiry.email.toLowerCase() });

            if (registeredUser) {
                // If member exists, send internal notification to their dashboard
                await Notification.create({
                    user: registeredUser._id,
                    message: `Admin replied to your inquiry: "${inquiry.subject}"`,
                    type: 'inquiry_reply'
                });
                console.log(`Internal Notification sent to registered member: ${registeredUser.name}`);
            }

            // 🔥 REAL EMAIL SENDING (via NodeMailer)
            try {
                if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_app_password_here') {
                    await sendEmail({
                        email: inquiry.email,
                        name: inquiry.name,
                        subject: `Re: ${inquiry.subject}`,
                        originSubject: inquiry.subject,
                        message: reply
                    });
                    console.log(`✅ Real Email sent to: ${inquiry.email}`);
                } else {
                    console.warn(`🛑 Skipping Email: SMTP Credentials missing in .env`);
                }
            } catch (emailErr) {
                console.error("❌ NodeMailer Error:", emailErr.message);
                // We don't fail the whole request just because email failed
            }

            res.json({ message: 'Reply processed successfully' });
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitContactForm,
    getInquiries,
    markInquiryRead,
    replyToInquiry
};
