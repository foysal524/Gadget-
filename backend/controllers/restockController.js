const { RestockRequest, Product, User, Notification } = require('../models');

exports.createRestockRequest = async (req, res) => {
  try {
    console.log('Restock request - Body:', req.body);
    console.log('Restock request - User:', req.user?.uid);
    
    const { productId, variation } = req.body;
    
    if (!productId) {
      console.log('Missing productId in request');
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PRODUCT_ID', message: 'Product ID is required' }
      });
    }
    
    const user = await User.findOne({ where: { uid: req.user.uid } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const existing = await RestockRequest.findOne({
      where: { userId: user.id, productId, status: 'pending' }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_REQUESTED', message: 'You already have a pending restock request for this product' }
      });
    }

    const request = await RestockRequest.create({
      userId: user.id,
      productId,
      variation
    });

    const admins = await User.findAll({ where: { role: 'admin' } });
    const product = await Product.findByPk(productId);
    
    for (const admin of admins) {
      await Notification.create({
        userId: admin.id,
        type: 'restock_request',
        title: 'New Restock Request',
        message: `${user.displayName || user.email} requested restock for ${product.name}${variation ? ` (${variation.color})` : ''}`,
        data: { requestId: request.id, productId }
      });
    }

    res.status(201).json({
      success: true,
      data: { request },
      message: 'Restock request submitted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.getRestockRequests = async (req, res) => {
  try {
    const requests = await RestockRequest.findAll({
      include: [
        { model: User, as: 'user', attributes: ['email', 'displayName'] },
        { model: Product, as: 'product', attributes: ['name', 'images'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateRestockStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await RestockRequest.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: Product, as: 'product' }
      ]
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: { code: 'REQUEST_NOT_FOUND', message: 'Restock request not found' }
      });
    }

    request.status = status;
    await request.save();

    if (status === 'restocked') {
      await Notification.create({
        userId: request.userId,
        type: 'restock_complete',
        title: 'Product Restocked',
        message: `${request.product.name}${request.variation ? ` (${request.variation.color})` : ''} is now back in stock!`,
        data: { productId: request.productId }
      });
    }

    res.json({
      success: true,
      data: { request },
      message: 'Restock request updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
