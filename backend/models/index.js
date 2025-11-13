const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const Wishlist = require('./Wishlist');
const Order = require('./Order');
const Review = require('./Review');
const RestockRequest = require('./RestockRequest');
const Notification = require('./Notification');
const Chat = require('./Chat');
const Address = require('./Address');

// Define associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });

RestockRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
RestockRequest.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Chat.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Chat, { foreignKey: 'userId', as: 'chats' });

Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });

module.exports = {
  User,
  Category,
  Product,
  Cart,
  Wishlist,
  Order,
  Review,
  RestockRequest,
  Notification,
  Chat,
  Address
};
