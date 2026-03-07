const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

function print(path, layer) {
    if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path + layer.route.path));
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path + (layer.regexp.source.replace('\\/', '/').replace('\\?$', '').replace('(?=\\/|$)', ''))));
    } else if (layer.method) {
        console.log('%s %s', layer.method.toUpperCase(), path);
    }
}

console.log("Registered Routes:");
app._router.stack.forEach(print.bind(null, ''));
process.exit();
