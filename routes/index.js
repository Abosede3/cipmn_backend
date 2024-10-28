const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');

router.use('/api/auth', authRoutes);

// Home route
router.get('/', (req, res) => {
  res.render('index'); // Render the 'index.ejs' view
});

module.exports = router;
