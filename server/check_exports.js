const userController = require('./controllers/userController');
console.log('Available Exports:', Object.keys(userController));
if (userController.deleteUserPlan) {
    console.log('deleteUserPlan is EXPORTED! ✅');
} else {
    console.log('deleteUserPlan is MISSING! ❌');
}
process.exit();
