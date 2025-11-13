const { Category, Product } = require('../models');

exports.getCategories = async (req, res) => {
  try {
    const allCategories = await Category.findAll({
      attributes: ['id', 'name', 'image', 'parentId', 'createdAt'],
      order: [['name', 'ASC']]
    });

    const productCounts = {};
    for (const cat of allCategories) {
      productCounts[cat.id] = await Product.count({ where: { categoryId: cat.id } });
    }

    const categories = allCategories.filter(cat => !cat.parentId);
    
    const categoriesWithCount = categories.map(cat => {
      const subcategories = allCategories
        .filter(sub => sub.parentId === cat.id)
        .map(sub => ({
          id: sub.id,
          name: sub.name,
          image: sub.image,
          parentId: sub.parentId,
          productCount: productCounts[sub.id] || 0
        }));
      
      const totalSubcategoryProducts = subcategories.reduce((sum, sub) => sum + sub.productCount, 0);
      
      return {
        id: cat.id,
        name: cat.name,
        image: cat.image,
        parentId: cat.parentId,
        productCount: (productCounts[cat.id] || 0) + totalSubcategoryProducts,
        subcategories,
        createdAt: cat.createdAt
      };
    });

    res.json({
      success: true,
      data: {
        categories: categoriesWithCount
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
