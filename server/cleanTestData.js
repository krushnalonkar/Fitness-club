const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/GymPortal').then(async () => {
    try {
        const db = mongoose.connection.db;
        const col = db.collection('testimonials');
        await col.deleteMany({ feedback: 'Test feedback from Akash' });
        console.log('Cleaned test data');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
});
