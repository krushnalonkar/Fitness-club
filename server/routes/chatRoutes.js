const express = require('express');
const router = express.Router();
const { generatePromptResponse } = require('../controllers/chatController');

// @route   POST /api/chat
// @desc    Generate a chat response using Gemini API
// @access  Public
router.post('/', generatePromptResponse);

module.exports = router;
