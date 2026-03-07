const express = require('express');
const router = express.Router();
const { getTrainers, createTrainer, deleteTrainer, updateTrainer } = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getTrainers);
router.post('/', protect, createTrainer);
router.put('/:id', protect, updateTrainer);
router.delete('/:id', protect, deleteTrainer);

module.exports = router;
