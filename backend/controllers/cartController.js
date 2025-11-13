const { Cart, Product, User } = require('../models');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const cartItems = await Cart.findAll({
      where: { userId: user.id },
      include: [{ model: Product, as: 'product' }]
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = parseInt(item.variation?.price || item.product.price);
      return sum + (price * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        cart: {
          id: user.id,
          userId: user.id,
          items: cartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.variation?.price || item.product.price,
              image: item.product.images[0] || null,
              inStock: item.product.inStock,
              stockQuantity: item.variation?.stock || item.product.stockQuantity
            },
            variation: item.variation,
            quantity: item.quantity,
            addedAt: item.createdAt
          })),
          totalItems,
          totalAmount,
          updatedAt: new Date()
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

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variation = null } = req.body;

    const user = await User.findOne({ where: { uid: req.user.uid } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' }
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        error: { code: 'OUT_OF_STOCK', message: 'Product is out of stock' }
      });
    }

    let cartItem;
    if (variation) {
      const existingItems = await Cart.findAll({ where: { userId: user.id, productId } });
      cartItem = existingItems.find(item => 
        item.variation && 
        item.variation.color === variation.color &&
        item.variation.ram === variation.ram &&
        item.variation.rom === variation.rom
      );
    } else {
      cartItem = await Cart.findOne({ where: { userId: user.id, productId, variation: null } });
    }

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      const maxStock = variation ? variation.stock : product.stockQuantity;
      if (newQuantity > maxStock) {
        return res.status(400).json({
          success: false,
          error: { code: 'INSUFFICIENT_STOCK', message: `Only ${maxStock} items available` }
        });
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: user.id,
        productId,
        quantity,
        variation
      });
    }

    res.status(201).json({
      success: true,
      data: {
        cartItem: {
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          addedAt: cartItem.createdAt
        }
      },
      message: 'Item added to cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const cartItem = await Cart.findOne({
      where: { id: req.params.itemId, userId: user.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: { code: 'CART_ITEM_NOT_FOUND', message: 'Cart item not found' }
      });
    }

    const maxStock = cartItem.variation ? cartItem.variation.stock : cartItem.product.stockQuantity;
    if (quantity > maxStock) {
      return res.status(400).json({
        success: false,
        error: { code: 'INSUFFICIENT_STOCK', message: `Only ${maxStock} items available` }
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      success: true,
      data: { cartItem },
      message: 'Cart item updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const cartItem = await Cart.findOne({
      where: { id: req.params.itemId, userId: user.id }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: { code: 'CART_ITEM_NOT_FOUND', message: 'Cart item not found' }
      });
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.mergeCart = async (req, res) => {
  try {
    const { guestCart, action } = req.body;
    
    console.log('Merge request:', { guestCart, action, uid: req.user.uid });
    
    const user = await User.findOne({ where: { uid: req.user.uid } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    if (!guestCart || !Array.isArray(guestCart)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_GUEST_CART', message: 'Guest cart must be an array' }
      });
    }

    if (action === 'current') {
      await Cart.destroy({ where: { userId: user.id } });
      for (const item of guestCart) {
        await Cart.create({ userId: user.id, productId: item.productId, quantity: item.quantity });
      }
    } else if (action === 'previous') {
      // Keep saved cart, do nothing
    } else if (action === 'merge') {
      for (const guestItem of guestCart) {
        const existing = await Cart.findOne({ 
          where: { userId: user.id, productId: guestItem.productId } 
        });
        if (existing) {
          existing.quantity += guestItem.quantity;
          await existing.save();
          console.log('Updated existing item:', existing.productId, 'new qty:', existing.quantity);
        } else {
          const newItem = await Cart.create({ userId: user.id, productId: guestItem.productId, quantity: guestItem.quantity });
          console.log('Created new item:', newItem.productId);
        }
      }
    }

    const updatedCart = await Cart.findAll({
      where: { userId: user.id },
      include: [{ model: Product, as: 'product' }]
    });

    console.log('Merge complete, cart items:', updatedCart.length);

    res.json({
      success: true,
      data: { cart: updatedCart },
      message: 'Cart merged successfully'
    });
  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
