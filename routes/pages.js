const express = require('express');
const router = express.Router();

// Index Route
router.get('/', (req, res) => {
res.send('Welcome to the backend!');
});

// About Route
router.get('/about', (req, res) => {
res.send('A Node.js Application developed by Johan Lindberg');
});


module.exports = router;
