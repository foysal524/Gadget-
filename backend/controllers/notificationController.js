const { Notification, User } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    
    const notifications = await Notification.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const unreadCount = await Notification.count({
      where: { userId: user.id, read: false }
    });

    res.json({
      success: true,
      data: { notifications, unreadCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: user.id }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found' }
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
