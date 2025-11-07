# Backend Setup Instructions for GadgetBazar

## Instructions for Backend Developer

### Step 1: Pull Latest Code
```bash
cd /path/to/your/workspace
git clone https://github.com/nahinfarhan/GadgetBazar.git
cd GadgetBazar
```

If already cloned:
```bash
cd GadgetBazar
git pull origin main
```

### Step 2: Ask Amazon Q to Build Backend

Copy and paste this prompt to Amazon Q:

---

**Prompt for Amazon Q:**

```
I need you to build a complete Node.js backend for the GadgetBazar e-commerce platform. 

Requirements:

1. **Database Setup:**
   - Use PostgreSQL or MongoDB (your choice)
   - Create database schema for:
     - Users (uid from Firebase, email, name, phone, address)
     - Products (id, name, description, price, originalPrice, category, brand, images, stock, specifications)
     - Cart (userId, productId, quantity)
     - Orders (orderId, userId, products, totalAmount, status, shippingAddress, createdAt)
     - Wishlist (userId, productId)

2. **API Endpoints:**
   - Products: GET /api/products, GET /api/products/:id, GET /api/products/category/:category, GET /api/products/search?q=query
   - Cart: GET /api/cart, POST /api/cart, PUT /api/cart/:id, DELETE /api/cart/:id
   - Orders: GET /api/orders, POST /api/orders, GET /api/orders/:id
   - Wishlist: GET /api/wishlist, POST /api/wishlist, DELETE /api/wishlist/:id
   - User: GET /api/user/profile, PUT /api/user/profile

3. **Authentication:**
   - Use the existing Firebase authentication middleware in /backend/middleware/auth.js
   - Protect all routes except product listing and search
   - Extract user info from Firebase token (uid, email, name)

4. **Project Structure:**
   - Place everything in /backend directory
   - Use Express.js framework
   - Follow MVC pattern: models/, routes/, controllers/
   - Add .env file for database credentials
   - Create package.json with all dependencies

5. **Additional Requirements:**
   - Add CORS for frontend (http://localhost:3000)
   - Add error handling middleware
   - Add input validation
   - Add database connection file
   - Create seed data for 20+ products
   - Add README.md with setup instructions

6. **Firebase Admin Setup:**
   - Initialize Firebase Admin SDK in the auth middleware
   - Add instructions for service account key setup

Start by creating the complete backend structure in the /backend folder.
```

---

### Step 3: After Backend is Built

1. **Install Dependencies:**
```bash
cd backend
npm install
```

2. **Setup Environment Variables:**
Create `.env` file in backend folder:
```env
PORT=5000
DATABASE_URL=your_database_url
NODE_ENV=development
```

3. **Setup Firebase Service Account:**
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `backend/serviceAccountKey.json`
   - Add to `.gitignore`

4. **Run Database Migrations/Seeds:**
```bash
npm run migrate  # or whatever command Amazon Q creates
npm run seed
```

5. **Start Backend Server:**
```bash
npm start
# or
npm run dev
```

6. **Test API:**
```bash
curl http://localhost:5000/api/products
```

### Step 4: Connect Frontend to Backend

Update frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Step 5: Push Backend Code

```bash
git add .
git commit -m "Add complete backend implementation"
git push origin main
```

---

## Quick Reference

**Repository:** https://github.com/nahinfarhan/GadgetBazar

**Frontend Port:** 3000
**Backend Port:** 5000 (recommended)

**Existing Files:**
- `/backend/middleware/auth.js` - Firebase authentication middleware
- `/backend/README.md` - Authentication documentation
- `/frontend/src/utils/api.js` - API utility functions

**Firebase Project:**
- Project ID: gadgetbazar-3207a
- Auth Domain: gadgetbazar-3207a.firebaseapp.com

---

## Troubleshooting

If Amazon Q asks for clarification:
- Database: Choose PostgreSQL or MongoDB based on your preference
- ORM: Sequelize (PostgreSQL) or Mongoose (MongoDB)
- Port: 5000
- API Base Path: /api

For any issues, refer to `/backend/README.md` for authentication setup.
