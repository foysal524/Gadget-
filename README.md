# GadgetBazar - E-commerce Platform

A full-stack e-commerce platform built with React.js and Node.js, featuring a complete admin panel for managing products, orders, and users.

## Features

### User Features
- 🛍️ Browse products by categories
- 🔍 Search and filter products
- 🛒 Add to cart (works without login)
- 👤 User authentication (Firebase)
- 📦 Order management
- 💳 Checkout process
- 📱 Responsive design

### Admin Features
- 📊 Dashboard with statistics
- 📦 Product management (CRUD)
- 🏷️ Category management with hierarchy
- 📋 Order management
- 👥 User management
- 🖼️ Image upload (Cloudinary)
- 📈 Real-time updates

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

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- Firebase Project
- Cloudinary Account

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
- `POST /api/auth/login` - User login

### Protected Routes
- `GET /api/cart` - Get user cart
- `POST /api/orders` - Create order
- `GET /api/admin/*` - Admin routes

## Project Structure

```
GadgetBazar/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & upload middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── scripts/        # Utility scripts
└── frontend/
    ├── public/         # Static files
    └── src/
        ├── components/ # React components
        ├── context/    # Context providers
        └── utils/      # Utility functions
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details.