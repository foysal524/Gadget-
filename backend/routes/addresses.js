const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const addressController = require('../controllers/addressController');

router.get('/', verifyToken, addressController.getAddresses);
router.post('/', verifyToken, addressController.createAddress);
router.put('/:id', verifyToken, addressController.updateAddress);
router.delete('/:id', verifyToken, addressController.deleteAddress);

module.exports = router;
