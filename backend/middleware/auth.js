const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin for user project
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
let userApp, adminApp;

if (fs.existsSync(serviceAccountPath)) {
  userApp = admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
    storageBucket: 'gadgetbazar-3207a.appspot.com'
  }, 'user');
  console.log('✓ User Firebase initialized');
} else {
  console.warn('Warning: serviceAccountKey.json not found. User authentication will not work.');
}

// Initialize Firebase Admin for admin project
const adminServiceAccountPath = path.join(__dirname, '../adminServiceAccountKey.json');
if (fs.existsSync(adminServiceAccountPath)) {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(require(adminServiceAccountPath)),
    storageBucket: 'gadgetbazar-admin.firebasestorage.app'
  }, 'admin');
  console.log('✓ Admin Firebase initialized');
} else {
  console.warn('Warning: adminServiceAccountKey.json not found. Admin authentication will not work.');
}

// Verify Firebase token middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    let decodedToken;
    let isAdmin = false;
    
    // Try admin Firebase first, then user Firebase
    try {
      if (adminApp) {
        decodedToken = await admin.auth(adminApp).verifyIdToken(token);
        isAdmin = true;
      }
    } catch (adminError) {
      // Try user Firebase if admin fails
      try {
        if (userApp) {
          decodedToken = await admin.auth(userApp).verifyIdToken(token);
        }
      } catch (userError) {
        throw new Error('Invalid token for both projects');
      }
    }
    
    if (!decodedToken) {
      throw new Error('No Firebase app available');
    }
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      isAdminAuth: isAdmin
    };
    
    // Auto-create user in database if doesn't exist
    const { User } = require('../models');
    let user = await User.findOne({ where: { uid: decodedToken.uid } });
    
    if (!user) {
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email.split('@')[0],
        role: isAdmin ? 'admin' : 'customer'
      });
    } else {
      // If authenticated via admin Firebase, ensure admin role
      if (isAdmin && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
      
      // Update display name if needed
      if (!user.displayName && decodedToken.name) {
        user.displayName = decodedToken.name;
        await user.save();
      }
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken };
