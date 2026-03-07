const Trainer = require('../models/Trainer');

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Public
const getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find({});
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a trainer
// @route   POST /api/trainers
// @access  Private/Admin
const createTrainer = async (req, res) => {
    try {
        const { name, specialty, experience, image } = req.body;
        const trainer = await Trainer.create({
            name,
            specialty,
            experience,
            image
        });
        res.status(201).json(trainer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a trainer
// @route   PUT /api/trainers/:id
// @access  Private/Admin
const updateTrainer = async (req, res) => {
    try {
        const { name, specialty, experience, image } = req.body;
        const trainer = await Trainer.findById(req.params.id);

        if (trainer) {
            trainer.name = name || trainer.name;
            trainer.specialty = specialty || trainer.specialty;
            trainer.experience = experience || trainer.experience;
            trainer.image = image || trainer.image;

            const updatedTrainer = await trainer.save();
            res.json(updatedTrainer);
        } else {
            res.status(404).json({ message: 'Trainer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a trainer
// @route   DELETE /api/trainers/:id
// @access  Private/Admin
const deleteTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (trainer) {
            await trainer.deleteOne();
            res.json({ message: 'Trainer removed successfully' });
        } else {
            res.status(404).json({ message: 'Trainer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTrainers,
    createTrainer,
    deleteTrainer,
    updateTrainer
};
