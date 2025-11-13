const { Address, User } = require('../models');

exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    const addresses = await Address.findAll({
      where: { userId: user.id },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    
    if (req.body.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: user.id } });
    }

    const address = await Address.create({
      ...req.body,
      userId: user.id
    });

    res.status(201).json({
      success: true,
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    const address = await Address.findOne({
      where: { id: req.params.id, userId: user.id }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: { code: 'ADDRESS_NOT_FOUND', message: 'Address not found' }
      });
    }

    if (req.body.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: user.id } });
    }

    await address.update(req.body);

    res.json({
      success: true,
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    const address = await Address.findOne({
      where: { id: req.params.id, userId: user.id }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: { code: 'ADDRESS_NOT_FOUND', message: 'Address not found' }
      });
    }

    await address.destroy();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
