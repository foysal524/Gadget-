const { Product, Category, Order, User, RestockRequest, Notification, Wishlist } = require('../models');
const { Op } = require('sequelize');

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalCategories, totalOrders, totalUsers] = await Promise.all([
      Product.count(),
      Category.count(),
      Order.count(),
      User.count()
    ]);

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['email', 'displayName'] }]
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalUsers
        },
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

// Product management
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: { product },
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' }
      });
    }

    const wasOutOfStock = !product.inStock;
    const oldPrice = product.price;
    
    // Auto-update inStock based on stockQuantity
    if (req.body.stockQuantity !== undefined) {
      req.body.inStock = req.body.stockQuantity > 0;
    }
    
    await product.update(req.body);
    
    // Check for price drop and notify wishlist users
    if (req.body.price && req.body.price < oldPrice) {
      const wishlistItems = await Wishlist.findAll({
        where: { productId: product.id }
      });
      
      for (const item of wishlistItems) {
        await Notification.create({
          userId: item.userId,
          type: 'price_drop',
          title: 'Price Drop Alert!',
          message: `${product.name} price dropped from BDT ${oldPrice} to BDT ${req.body.price}`,
          data: { productId: product.id }
        });
      }
    }
    
    // If product was out of stock and now is in stock, notify users
    if (wasOutOfStock && product.inStock) {
      // Notify restock request users
      const restockRequests = await RestockRequest.findAll({
        where: { productId: product.id, status: 'pending' }
      });
      
      for (const request of restockRequests) {
        const variationText = request.variation ? ` (${request.variation.color})` : '';
        await Notification.create({
          userId: request.userId,
          type: 'restock_complete',
          title: 'Product Back in Stock!',
          message: `${product.name}${variationText} is now available. Order now before it runs out again!`,
          data: { productId: product.id }
        });
        
        await request.update({ status: 'restocked' });
      }
      
      // Notify wishlist users
      const wishlistItems = await Wishlist.findAll({
        where: { productId: product.id }
      });
      
      for (const item of wishlistItems) {
        await Notification.create({
          userId: item.userId,
          type: 'restock',
          title: 'Wishlist Item Back in Stock!',
          message: `${product.name} from your wishlist is now available!`,
          data: { productId: product.id }
        });
      }
    }
    
    res.json({
      success: true,
      data: { product },
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' }
      });
    }

    await product.destroy();
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

// Category management
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      data: { category },
      message: 'Category created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' }
      });
    }

    await category.update(req.body);
    res.json({
      success: true,
      data: { category },
      message: 'Category updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' }
      });
    }

    await category.destroy();
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

// Order management
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['email', 'displayName', 'phone'] }],
      limit: Math.min(limit, 100),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    const ordersWithProducts = await Promise.all(rows.map(async (order) => {
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
      data: {
        orders: ordersWithProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' }
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: { order },
      message: 'Order status updated successfully'
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
    const order = await Order.findByPk(req.params.id);
    
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

// User management
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const { count, rows } = await User.findAndCountAll({
      limit: Math.min(limit, 100),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: { user },
      message: 'User role updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
