const { User } = require('../models');

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required'
        }
      });
    }
    
    req.adminUser = user;
    next();
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

module.exports = { requireAdmin };
