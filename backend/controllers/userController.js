const { User } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { displayName, phone, address, role } = req.body;
    const user = await User.findOne({ where: { uid: req.user.uid } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    if (displayName) user.displayName = displayName;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      data: { user },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
