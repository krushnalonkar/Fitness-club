const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://127.0.0.1:27017/GymPortal').then(async () => {
    try {
        const user = await mongoose.connection.db.collection('users').findOne({ email: 'akashborge83@gmail.com' });
        const token = jwt.sign({ id: user._id }, 'fitness_club_secure_key_2024', { expiresIn: '30d' });

        const res = await fetch('http://localhost:5000/api/testimonials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                rating: 4,
                feedback: 'Test feedback from Akash'
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('Success:', data);
        } else {
            console.error('Test failed:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
});
