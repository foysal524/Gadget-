const express = require('express');
const csrf = require('csrf');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const tokens = new csrf();

const csrfProtection = (req, res, next) => {
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const secret = req.session?.csrfSecret;
  
  if (!secret || !tokens.verify(secret, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
};

router.get('/', verifyToken, notificationController.getNotifications);
router.put('/:id/read', verifyToken, notificationController.markAsRead);

module.exports = router;
