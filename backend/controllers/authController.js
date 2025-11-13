const { User } = require('../models');

exports.verifyToken = async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    let user = await User.findOne({ where: { uid } });

    if (!user) {
      // Check if user exists with this email (created by admin script)
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        // Update the UID to match Firebase
        existingUser.uid = uid;
        if (name) existingUser.displayName = name;
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = await User.create({
          uid,
          email,
          displayName: name || email.split('@')[0]
        });
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
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
