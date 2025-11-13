const express = require('express');
const router = express.Router();
const { aiChat } = require('../controllers/aiChatController');

router.post('/message', aiChat);

module.exports = router;
