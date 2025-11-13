const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

router.get('/', verifyToken, wishlistController.getWishlist);
router.post('/items', verifyToken, wishlistController.addToWishlist);
router.delete('/items/:itemId', verifyToken, wishlistController.removeFromWishlist);

module.exports = router;
