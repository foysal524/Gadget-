const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/verify-token', verifyToken, authController.verifyToken);

module.exports = router;
