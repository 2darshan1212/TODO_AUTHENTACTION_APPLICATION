const express = require('express');
const router = express.Router();

// Health check route
router.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
  });
});

// Auth routes
router.use('/auth', require('./auth'));

// Todo routes
router.use('/todos', require('./todos'));

module.exports = router;

