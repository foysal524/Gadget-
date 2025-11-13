const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
// Load all models to ensure associations are set up
require('./models');
const { User, Product, RestockRequest, Notification } = require('./models');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/restock', require('./routes/restock'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai-chat', require('./routes/aiChat'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/payment', require('./routes/payment'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'GadgetBazar API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

const PORT = process.env.PORT || 8000;

// Database connection and server start
sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connected successfully');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    console.log('✓ Database models synchronized');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('✗ Unable to connect to database:', err);
    process.exit(1);
  });

module.exports = app;
