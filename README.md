# GadgetBazar - E-commerce Platform

A full-stack e-commerce platform built with React.js and Node.js, featuring a complete admin panel for managing products, orders, and users.

## Features

### User Features
- 🛍️ **Product Browsing**
  - Browse products by categories and subcategories
  - Dynamic category navigation with hover dropdowns
  - Product filtering and sorting
  - Discounted products section
  - Hot deals showcase

- 🔍 **Search & Discovery**
  - Real-time product search
  - Search suggestions
  - Category-based filtering
  - Price range filtering

- 🛒 **Shopping Cart**
  - Add to cart (works without login)
  - Guest cart with merge functionality
  - Cart persistence across sessions
  - Product variations support (color, RAM, ROM)
  - Quantity management

- 💝 **Wishlist**
  - Save favorite products
  - Quick add/remove from product pages
  - Wishlist management page
  - Price drop notifications

- 👤 **User Authentication**
  - Firebase authentication
  - Email/Password login
  - Google Sign-in
  - Profile management
  - Order history

- 📦 **Order Management**
  - Complete order tracking
  - Order details with product images
  - Order status updates
  - Order cancellation
  - Multiple payment methods

- 💳 **Checkout & Payment**
  - Multi-step checkout process
  - Address book integration
  - Saved addresses with labels
  - SSLCommerz payment gateway
  - Cash on Delivery
  - bKash payment option

- 🔔 **Notifications**
  - Real-time notifications
  - Restock alerts
  - Price drop alerts
  - Order status updates
  - Unread notification counter

- 🤖 **AI Shopping Assistant**
  - Intelligent chatbot powered by Groq AI
  - Product recommendations
  - Natural language queries
  - Budget-based suggestions
  - Category-specific assistance

- 📍 **Address Management**
  - Multiple saved addresses
  - Address labels (Home, Office, etc.)
  - Default address selection
  - Quick address selection at checkout

- 💬 **Customer Support Chat**
  - AI assistant mode
  - Human support mode
  - Real-time messaging
  - Chat history

- 📱 **Responsive Design**
  - Mobile-first approach
  - Tablet optimized
  - Desktop enhanced
  - Smooth animations

### Admin Features
- 📊 **Dashboard**
  - Total products, categories, orders, users
  - Recent orders overview
  - Quick statistics
  - Real-time updates

- 📦 **Product Management**
  - Complete CRUD operations
  - Product image thumbnails in list
  - Search products by name/brand
  - Bulk image upload
  - Product variations (color, RAM, ROM)
  - Stock management
  - Specifications management
  - Price and discount settings
  - New/Deal badges

- 🏷️ **Category Management**
  - Hierarchical categories
  - Parent-child relationships
  - Subcategory support
  - Category icons
  - Product count per category

- 📋 **Order Management**
  - View all orders
  - Order details with product images
  - Status management (pending, processing, shipped, delivered, cancelled)
  - Order filtering by status
  - Delete orders
  - Customer information
  - Payment details

- 👥 **User Management**
  - View all users
  - User role management
  - User statistics
  - Account creation dates

- 🔄 **Restock Management**
  - View restock requests
  - Approve/reject requests
  - Automatic notifications on restock
  - Product variation tracking

- 🔔 **Notification System**
  - Send notifications to users
  - Restock alerts
  - Price drop notifications
  - Order status updates
  - Wishlist item notifications

- 💬 **Admin Chat**
  - View active customer chats
  - Respond to customer queries
  - Chat history
  - User identification

- 🖼️ **Media Management**
  - Cloudinary integration
  - Direct file upload
  - URL-based image addition
  - Image preview
  - Multiple images per product

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Firebase Authentication
- React Router
- Context API

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Firebase Admin SDK
- Cloudinary (Image Storage)
- Groq AI (Chatbot)
- SSLCommerz (Payment Gateway)
- sslcommerz-lts package

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Firebase Project
- Cloudinary Account
- Groq API Key (for AI chatbot)
- SSLCommerz Account (for payment gateway)

### 1. Clone Repository
```bash
git clone https://github.com/nahinfarhan/GadgetBazar.git
cd GadgetBazar
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=8000
NODE_ENV=development

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=gadgetbazar
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password

# CORS
CORS_ORIGIN=http://localhost:3000

# Firebase Project ID
FIREBASE_PROJECT_ID=your_firebase_project_id

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq AI (Chatbot)
GROQ_API_KEY=your_groq_api_key

# SSLCommerz Payment Gateway
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

Add Firebase service account key as `serviceAccountKey.json` in backend folder.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb gadgetbazar

# Run migrations (from backend folder)
npm run migrate
```

### 5. Run Application
```bash
# Backend (from backend folder)
npm start

# Frontend (from frontend folder)
npm start
```

## Configuration Guide

### Firebase Setup
1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Generate service account key
4. Add configuration to `.env` files

### Cloudinary Setup
1. Create account at https://cloudinary.com
2. Get cloud name, API key, and API secret
3. Add to backend `.env` file

### Groq AI Setup (Chatbot)
1. Sign up at https://console.groq.com
2. Create API key
3. Add `GROQ_API_KEY` to backend `.env` file
4. Chatbot will automatically work in support chat

### SSLCommerz Setup (Payment Gateway)

#### For Testing (Sandbox):
- Use provided credentials in `.env`:
  - Store ID: `testbox`
  - Store Password: `qwerty`
- These work immediately for testing

#### For Production:
1. Sign up at https://sslcommerz.com
2. Submit business documents
3. Get approved (2-3 days)
4. Get Store ID and Store Password from merchant panel
5. Update `.env`:
   ```
   SSLCOMMERZ_STORE_ID=your_real_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_real_store_password
   NODE_ENV=production
   ```

### Database Setup
1. Install PostgreSQL
2. Create database named `gadgetbazar`
3. Update database credentials in `.env`

## Admin Access

To create an admin user:
```bash
cd backend
node scripts/createAdminUser.js
```

Default admin credentials will be displayed in console.

## API Endpoints

### Public Routes
- `GET /api/products` - Get products
- `GET /api/categories` - Get categories
- `GET /api/products/:id` - Get product details

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected User Routes
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add to cart
- `DELETE /api/cart/items/:id` - Remove from cart
- `POST /api/cart/merge` - Merge guest cart

- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/items` - Add to wishlist
- `POST /api/wishlist/toggle/:productId` - Toggle wishlist
- `GET /api/wishlist/check/:productId` - Check if in wishlist

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `DELETE /api/orders/:id` - Delete order

- `GET /api/addresses` - Get saved addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

- `POST /api/restock/requests` - Request restock notification

- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/messages` - Send message

- `POST /api/ai-chat/message` - AI chatbot query

- `POST /api/payment/initiate` - Initiate SSLCommerz payment

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `DELETE /api/admin/orders/:id` - Delete order

- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

- `GET /api/admin/restock` - Get restock requests
- `PUT /api/admin/restock/:id` - Update restock status

- `POST /api/admin/upload` - Upload image to Cloudinary

## Key Features Explained

### 1. AI Shopping Assistant
- Powered by Groq AI (llama-3.3-70b-versatile model)
- Understands natural language queries
- Provides product recommendations based on:
  - Budget constraints
  - Category preferences
  - Product specifications
- Displays related products with images
- Toggle between AI and human support

### 2. Smart Notification System
- **Restock Notifications**: Users get notified when out-of-stock products are available
- **Price Drop Alerts**: Automatic notifications when wishlist items go on sale
- **Order Updates**: Real-time order status notifications
- **Wishlist Alerts**: Notifications for wishlist item availability
- Unread counter in header
- Mark as read functionality

### 3. SSLCommerz Payment Integration
- Secure payment gateway for Bangladesh
- Supports:
  - Credit/Debit cards
  - Mobile banking (bKash, Nagad, Rocket)
  - Internet banking
- Sandbox mode for testing
- Production mode for live payments
- Automatic order status update on payment
- Payment success/failure pages

### 4. Address Book System
- Save multiple addresses
- Label addresses (Home, Office, etc.)
- Set default address
- Quick selection at checkout
- Edit/delete addresses
- Auto-fill checkout form

### 5. Advanced Product Management
- Product variations (color, RAM, ROM)
- Multiple images per product
- Specifications in JSON format
- Stock tracking per variation
- Automatic stock updates on orders
- Out of stock handling

### 6. Guest Cart with Smart Merge
- Shop without login
- Cart persists in localStorage
- On login, choose to:
  - Keep guest cart
  - Keep saved cart
  - Merge both carts
- Seamless shopping experience

## Project Structure

```
GadgetBazar/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL config
│   ├── controllers/
│   │   ├── addressController.js # Address CRUD
│   │   ├── adminController.js   # Admin operations
│   │   ├── aiChatController.js  # AI chatbot
│   │   ├── authController.js    # Authentication
│   │   ├── cartController.js    # Cart operations
│   │   ├── categoryController.js
│   │   ├── chatController.js    # Support chat
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js # SSLCommerz
│   │   ├── productController.js
│   │   ├── restockController.js
│   │   ├── userController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── adminAuth.js         # Admin verification
│   │   └── upload.js            # Cloudinary upload
│   ├── models/
│   │   ├── Address.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Chat.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── RestockRequest.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   ├── Wishlist.js
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── addresses.js
│   │   ├── admin.js
│   │   ├── aiChat.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── categories.js
│   │   ├── chat.js
│   │   ├── notifications.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   ├── products.js
│   │   ├── restock.js
│   │   ├── user.js
│   │   └── wishlist.js
│   ├── scripts/
│   │   ├── createAdmin.js       # Create admin user
│   │   ├── migrate.js           # Database migration
│   │   └── seed.js              # Seed data
│   └── server.js                # Express app
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── address/
        │   │   └── AddressBook.js
        │   ├── admin/
        │   │   ├── AdminChat.js
        │   │   ├── AdminDashboard.js
        │   │   ├── AdminLayout.js
        │   │   ├── CategoryManagement.js
        │   │   ├── OrderManagement.js
        │   │   ├── ProductManagement.js
        │   │   └── RestockRequests.js
        │   ├── auth/
        │   │   ├── Login.js
        │   │   └── Signup.js
        │   ├── cart/
        │   │   ├── Cart.js
        │   │   └── CartMergeModal.js
        │   ├── catalog/
        │   │   ├── ProductCatalog.js
        │   │   ├── SearchResults.js
        │   │   └── Discounted.js
        │   ├── chat/
        │   │   └── UserChat.js      # AI + Human support
        │   ├── checkout/
        │   │   └── Checkout.js
        │   ├── home/
        │   │   └── Homepage.js
        │   ├── layout/
        │   │   ├── Header.js
        │   │   ├── Navigation.js
        │   │   └── Layout.js
        │   ├── notifications/
        │   │   └── Notifications.js
        │   ├── orders/
        │   │   └── Orders.js
        │   ├── payment/
        │   │   ├── PaymentSuccess.js
        │   │   └── PaymentFailed.js
        │   ├── product/
        │   │   └── ProductDetail.js
        │   ├── profile/
        │   │   └── Profile.js
        │   └── wishlist/
        │       └── Wishlist.js
        ├── context/
        │   └── CartContext.js       # Global cart state
        ├── utils/
        │   ├── api.js               # API helper
        │   ├── adminApi.js          # Admin API helper
        │   └── guestCart.js         # Guest cart logic
        └── App.js
```

## Environment Variables

### Backend (.env)
```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=gadgetbazar
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password

# CORS
CORS_ORIGIN=http://localhost:3000

# Firebase
FIREBASE_PROJECT_ID=your_project_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq AI
GROQ_API_KEY=your_groq_api_key

# SSLCommerz
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -l`

### Firebase Authentication Issues
- Verify Firebase config in frontend `.env`
- Check service account key in backend
- Ensure Firebase Authentication is enabled

### Cloudinary Upload Issues
- Verify Cloudinary credentials
- Check upload preset settings
- Ensure file size is within limits

### AI Chatbot Not Working
- Verify Groq API key is set
- Check API key validity at https://console.groq.com
- Ensure backend is running

### Payment Gateway Issues
- For testing, use sandbox credentials
- For production, verify SSLCommerz account is active
- Check callback URLs are correct

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@gadgetbazar.com

## Acknowledgments

- Firebase for authentication
- Cloudinary for image hosting
- Groq for AI capabilities
- SSLCommerz for payment processing
- PostgreSQL for database
- React and Node.js communities