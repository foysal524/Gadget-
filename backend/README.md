# Backend Authentication Setup

## How to use Firebase Authentication with Backend

### 1. Frontend sends token with every request:
```javascript
import { apiCall } from './utils/api';

// Example: Get user profile
const profile = await apiCall('/api/user/profile');

// Example: Add to cart
const result = await apiCall('/api/cart', {
  method: 'POST',
  body: JSON.stringify({ productId: 1, quantity: 2 })
});
```

### 2. Backend verifies token:
```javascript
const express = require('express');
const { verifyToken } = require('./middleware/auth');

const app = express();

// Protected route
app.get('/api/user/profile', verifyToken, (req, res) => {
  // req.user contains: { uid, email, name }
  res.json({ user: req.user });
});
```

### 3. Setup Firebase Admin SDK:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate new private key
3. Save as `serviceAccountKey.json` in backend folder
4. Uncomment initialization code in `middleware/auth.js`

### 4. Install dependencies:
```bash
npm install firebase-admin
```
