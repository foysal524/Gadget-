const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.get('/', verifyToken, cartController.getCart);
router.post('/items', verifyToken, cartController.addToCart);
router.put('/items/:itemId', verifyToken, cartController.updateCartItem);
router.delete('/items/:itemId', verifyToken, cartController.removeFromCart);
router.post('/merge', verifyToken, cartController.mergeCart);

module.exports = router;
