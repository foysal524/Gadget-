const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RestockRequest = sequelize.define('RestockRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  variation: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'restocked', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  tableName: 'restock_requests'
});

module.exports = RestockRequest;
