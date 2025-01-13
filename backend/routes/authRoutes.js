const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateToken, getUserProfile);

module.exports = router; 





