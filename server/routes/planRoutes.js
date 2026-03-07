const express = require('express');
const router = express.Router();
const { getPlans, addPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPlans);
router.post('/', protect, addPlan);
router.put('/:id', protect, updatePlan);
router.delete('/:id', protect, deletePlan);

module.exports = router;
