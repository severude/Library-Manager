// Routing declarations
const express = require('express');
const router = express.Router();

// Render home page route
router.get('/', (req, res) => {
    res.render('home');
});

module.exports = router;
