// routes/auth.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/verifyToken', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
});

module.exports = router;
