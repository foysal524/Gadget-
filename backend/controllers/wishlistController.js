const { Wishlist, Product, User } = require('../models');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    
    const wishlistItems = await Wishlist.findAll({
      where: { userId: user.id },
      include: [{ model: Product, as: 'product' }]
    });

    res.json({
      success: true,
      data: {
        wishlist: wishlistItems.map(item => ({
          id: item.id,
          productId: item.productId,
          product: item.product,
          addedAt: item.createdAt
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' }
      });
    }

    const existing = await Wishlist.findOne({
      where: { userId: user.id, productId }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'ALREADY_IN_WISHLIST', message: 'Product already in wishlist' }
      });
    }

    const wishlistItem = await Wishlist.create({
      userId: user.id,
      productId
    });

    res.status(201).json({
      success: true,
      data: { wishlistItem },
      message: 'Item added to wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const wishlistItem = await Wishlist.findOne({
      where: { id: req.params.itemId, userId: user.id }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        error: { code: 'WISHLIST_ITEM_NOT_FOUND', message: 'Wishlist item not found' }
      });
    }

    await wishlistItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const existing = await Wishlist.findOne({
      where: { userId: user.id, productId }
    });

    if (existing) {
      await existing.destroy();
      return res.json({
        success: true,
        data: { inWishlist: false },
        message: 'Removed from wishlist'
      });
    }

    await Wishlist.create({ userId: user.id, productId });
    res.json({
      success: true,
      data: { inWishlist: true },
      message: 'Added to wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findOne({ where: { uid: req.user.uid } });

    const exists = await Wishlist.findOne({
      where: { userId: user.id, productId }
    });

    res.json({
      success: true,
      data: { inWishlist: !!exists }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
