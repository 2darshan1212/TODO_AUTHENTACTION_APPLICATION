const express = require('express');
const router = express.Router();

// Health check route
router.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
  });
});

// Example: Add more routes here
// router.use('/todos', require('./todos'));

module.exports = router;

