const { Order, User, Product } = require('../models');

exports.getOrders = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const orders = await Order.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']]
    });

    const ordersWithProducts = await Promise.all(orders.map(async (order) => {
      const items = order.items;
      const itemsWithProducts = await Promise.all(items.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          ...item,
          product: product ? {
            id: product.id,
            name: product.name,
            stockQuantity: product.stockQuantity,
            images: product.images
          } : null
        };
      }));
      return {
        ...order.toJSON(),
        items: itemsWithProducts
      };
    }));

    res.json({
      success: true,
      data: { orders: ordersWithProducts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const order = await Order.findOne({
      where: { id: req.params.id, userId: user.id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' }
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const order = await Order.findOne({
      where: { id: req.params.id, userId: user.id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' }
      });
    }

    await order.destroy();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentDetails } = req.body;
    const user = await User.findOne({ where: { uid: req.user.uid } });

    // Validate products and calculate total
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: { code: 'PRODUCT_NOT_FOUND', message: `Product ${item.productId} not found` }
        });
      }
      
      const itemPrice = item.variation?.price || product.price;
      const availableStock = item.variation ? item.variation.stock : product.stockQuantity;
      
      if (!product.inStock || availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: { code: 'INSUFFICIENT_STOCK', message: `Product ${product.name} has insufficient stock` }
        });
      }
      totalAmount += itemPrice * item.quantity;
    }

    // Decrease stock for each product
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (item.variation) {
        const variations = product.variations.map(v => {
          if (v.color === item.variation.color && v.ram === item.variation.ram && v.rom === item.variation.rom) {
            return { ...v, stock: v.stock - item.quantity };
          }
          return v;
        });
        product.variations = variations;
        product.stockQuantity = variations.reduce((sum, v) => sum + v.stock, 0);
      } else {
        product.stockQuantity -= item.quantity;
      }
      
      if (product.stockQuantity === 0) {
        product.inStock = false;
      }
      await product.save();
    }

    const order = await Order.create({
      userId: user.id,
      items,
      totalAmount,
      shippingAddress,
      phone: req.body.phone,
      paymentMethod,
      paymentDetails: paymentDetails || {}
    });

    // Clear user's cart
    const { Cart } = require('../models');
    await Cart.destroy({ where: { userId: user.id } });

    res.status(201).json({
      success: true,
      data: { order },
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
