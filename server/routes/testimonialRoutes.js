const express = require('express');
const router = express.Router();
const { addTestimonial, getTestimonials, deleteTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTestimonials)
    .post(protect, addTestimonial);

router.route('/:id')
    .delete(protect, deleteTestimonial);

module.exports = router;
