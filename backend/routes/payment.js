const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.post('/initiate', verifyToken, paymentController.initiatePayment);
router.post('/success', paymentController.paymentSuccess);
router.post('/fail', paymentController.paymentFail);
router.post('/cancel', paymentController.paymentCancel);

module.exports = router;
