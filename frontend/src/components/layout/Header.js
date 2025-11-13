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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const { apiCall } = await import('../../utils/api');
      const res = await apiCall('/api/notifications');
      setUnreadCount(res.data?.unreadCount || res.unreadCount || 0);
    } catch (error) {
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
      setShowSuggestions(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/products?search=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setSuggestions(data.data?.products || []);
    } catch (error) {
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const selectSuggestion = (product) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 relative z-50">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-16 animate-fade-in">
          {/* Logo */}
          <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-300">
            <img src="/logo.svg" alt="GadgetBazar" className="h-10 w-auto" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8 relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] max-h-96 overflow-y-auto">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => selectSuggestion(product)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <img
                      src={product.images[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-blue-600 font-semibold">BDT {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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