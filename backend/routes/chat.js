const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post('/messages', verifyToken, chatController.sendMessage);
router.get('/messages', verifyToken, chatController.getMessages);
router.get('/active', verifyToken, chatController.getActiveChats);

module.exports = router;
