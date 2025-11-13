const { Product, Category, Review, User } = require('../models');
const { Op } = require('sequelize');

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    const offset = (page - 1) * Math.min(limit, 100);
    const where = {};

    if (category) {
      const cat = await Category.findOne({ where: { name: category } });
      if (cat) {
        // Get all subcategories
        const subcategories = await Category.findAll({ where: { parentId: cat.id } });
        const categoryIds = [cat.id, ...subcategories.map(sub => sub.id)];
        where.categoryId = { [Op.in]: categoryIds };
      }
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseInt(minPrice);
      if (maxPrice) where.price[Op.lte] = parseInt(maxPrice);
    }

    if (inStock !== undefined) {
      where.inStock = inStock === 'true';
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit: Math.min(limit, 100),
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        products: rows.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice,
          images: p.images,
          category: p.category,
          categoryId: p.categoryId,
          brand: p.brand,
          specifications: p.specifications,
          rating: parseFloat(p.rating),
          reviewCount: p.reviewCount,
          inStock: p.inStock,
          stockQuantity: p.stockQuantity,
          isNew: p.isNew,
          isDeal: p.isDeal,
          variations: p.variations,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, as: 'user', attributes: ['displayName'] }]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          specifications: product.specifications,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          category: product.category,
          rating: parseFloat(product.rating),
          reviewCount: product.reviewCount,
          reviews: product.reviews.map(r => ({
            id: r.id,
            userId: r.userId,
            userName: r.user.displayName,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt
          })),
          inStock: product.inStock,
          stockQuantity: product.stockQuantity,
          isNew: product.isNew,
          isDeal: product.isDeal,
          variations: product.variations,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
};
