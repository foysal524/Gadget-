const { Chat, User } = require('../models');

exports.sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const user = await User.findOne({ where: { uid: req.user.uid } });
    
    const chat = await Chat.create({
      userId: req.user.isAdminAuth && userId ? userId : user.id,
      message,
      isAdmin: req.user.isAdminAuth || false
    });

    res.status(201).json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.user.uid } });
    const { userId } = req.query;
    
    let where = {};
    if (req.user.isAdminAuth && userId) {
      where.userId = userId;
    } else {
      where.userId = user.id;
    }

    const messages = await Chat.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['displayName', 'email'] }],
      order: [['createdAt', 'ASC']],
      limit: 100
    });

    res.json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};

exports.getActiveChats = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'customer' },
      attributes: ['id', 'displayName', 'email'],
      include: [{
        model: Chat,
        as: 'chats',
        attributes: ['id'],
        required: true
      }]
    });

    const uniqueUsers = users.map(u => ({ id: u.id, displayName: u.displayName, email: u.email }));

    res.json({
      success: true,
      data: { users: uniqueUsers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
};
