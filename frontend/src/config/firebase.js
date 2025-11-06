import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBth9i8gJYyVcr9q_1wflGuebZjQF6ja9I",
  authDomain: "gadgetbazar-3207a.firebaseapp.com",
  projectId: "gadgetbazar-3207a",
  storageBucket: "gadgetbazar-3207a.firebasestorage.app",
  messagingSenderId: "932693757805",
  appId: "1:932693757805:web:f1e85c18884164abe2d464"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();