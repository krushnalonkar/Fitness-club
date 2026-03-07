const express = require('express');
const router = express.Router();
const { submitContactForm, getInquiries, markInquiryRead, replyToInquiry } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitContactForm);
router.get('/', protect, getInquiries);
router.put('/:id/read', protect, markInquiryRead);
router.put('/:id/reply', protect, replyToInquiry);

module.exports = router;
