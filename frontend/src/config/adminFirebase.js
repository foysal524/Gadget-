import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const adminFirebaseConfig = {
  apiKey: process.env.REACT_APP_ADMIN_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_ADMIN_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_ADMIN_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_ADMIN_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_ADMIN_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ADMIN_FIREBASE_APP_ID
};

const adminApp = initializeApp(adminFirebaseConfig, 'admin');
export const adminAuth = getAuth(adminApp);