import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import UserChat from '../chat/UserChat';

const Layout = ({ children }) => {
  const [user] = useAuthState(auth);
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-40 bg-white">
        <Header />
        <Navigation />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <UserChat user={user} />
    </div>
  );
};

export default Layout;