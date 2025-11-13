import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useCart } from '../../context/CartContext';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = () => {
  const [user] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      const handleNotificationRead = () => fetchNotifications();
      window.addEventListener('notificationRead', handleNotificationRead);
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationRead', handleNotificationRead);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { apiCall } = await import('../../utils/api');
      const res = await apiCall('/api/notifications');
      setUnreadCount(res.data?.unreadCount || res.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setUnreadCount(0);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-16 animate-fade-in">
          {/* Logo */}
          <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-300">
            <img src="/Logo_GadgetBazar.png" alt="GadgetBazar" className="h-10 w-auto" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-md text-gray-900 placeholder-gray-500 font-medium"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 text-blue-600 hover:text-blue-700"
              >
                <SearchIcon />
              </button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-200" title="Cart">
              <ShoppingCartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link to="/notifications" className="relative text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-200" title="Notifications">
                  <NotificationsIcon />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-200" title="Profile">
                  <PersonIcon />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transform hover:scale-110 transition-transform duration-200"
                  title="Logout"
                >
                  <LogoutIcon />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-200" title="Login">
                  <LoginIcon />
                </Link>
                <Link to="/signup" className="text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-transform duration-200" title="Sign Up">
                  <PersonAddIcon />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;