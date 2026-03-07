const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/GymPortal').then(async () => {
    try {
        const db = mongoose.connection.db;
        const usersCol = db.collection('users');

        const user = await usersCol.findOne({ email: 'akashborge83@gmail.com' });

        if (!user) {
            console.log('User not found.');
            process.exit(0);
        }

        console.log(`Original plans count: ${user.bookedPlans ? user.bookedPlans.length : 0}`);

        if (user.bookedPlans && user.bookedPlans.length > 0) {
            // slice(2) removes the first two elements
            const remainingPlans = user.bookedPlans.slice(2);
            await usersCol.updateOne(
                { email: 'akashborge83@gmail.com' },
                { $set: { bookedPlans: remainingPlans } }
            );
            console.log(`Plans deleted successfully. Remaining plans: ${remainingPlans.length}`);
        } else {
            console.log('No plans to delete.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
});
