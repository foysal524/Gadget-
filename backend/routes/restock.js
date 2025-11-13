const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');
const restockController = require('../controllers/restockController');

router.post('/requests', verifyToken, restockController.createRestockRequest);
router.get('/requests', verifyToken, requireAdmin, restockController.getRestockRequests);
router.put('/requests/:id', verifyToken, requireAdmin, restockController.updateRestockStatus);

module.exports = router;
