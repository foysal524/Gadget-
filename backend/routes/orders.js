const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.get('/', verifyToken, orderController.getOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.post('/', verifyToken, orderController.createOrder);
router.delete('/:id', verifyToken, orderController.deleteOrder);

module.exports = router;
