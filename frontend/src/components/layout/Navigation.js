import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import InfoIcon from '@mui/icons-material/Info';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LaptopIcon from '@mui/icons-material/Laptop';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WatchIcon from '@mui/icons-material/Watch';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Navigation = () => {
  const [user] = useAuthState(auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data.categories);
        console.log('Categories loaded:', data.data.categories.map(c => ({ name: c.name, subs: c.subcategories?.length || 0 })));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getCategoryIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('phone')) return PhoneAndroidIcon;
    if (lowerName.includes('laptop') || lowerName.includes('computer')) return LaptopIcon;
    if (lowerName.includes('audio') || lowerName.includes('headphone')) return HeadphonesIcon;
    if (lowerName.includes('gaming') || lowerName.includes('game')) return SportsEsportsIcon;
    if (lowerName.includes('watch') || lowerName.includes('wearable')) return WatchIcon;
    return ShoppingBagIcon;
  };

  const userMenuItems = user ? [
    { icon: PersonIcon, label: 'Profile', path: '/profile' },
    { icon: ShoppingCartIcon, label: 'Cart', path: '/cart' },
    { icon: FavoriteIcon, label: 'Wishlist', path: '/wishlist' },
    { icon: LocalShippingIcon, label: 'Orders', path: '/orders' },
  ] : [];

  return (
    <>
      <nav className="bg-white/50 backdrop-blur-lg border-b border-white/20 relative z-30">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-14 relative">
            {/* Menu Button */}
            <button
              onMouseEnter={() => setIsSidebarOpen(true)}
              className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-lg text-white px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/30 flex items-center space-x-2"
            >
              <MenuIcon />
              <span className="font-medium">Menu</span>
            </button>

            {/* Center Buttons */}
            <div className="flex space-x-3 relative z-50">
              <Link
                to="/"
                className="bg-white/60 backdrop-blur-lg text-gray-700 hover:text-blue-600 px-4 py-2 rounded-2xl text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-white/30 flex items-center space-x-1"
              >
                <HomeIcon fontSize="small" />
                <span>Home</span>
              </Link>
              {categories.slice(0, 5).map((cat) => {
                const IconComponent = getCategoryIcon(cat.name);
                const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;
                return (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div 
                      className="bg-white/60 backdrop-blur-lg text-gray-700 hover:text-blue-600 px-4 py-2 rounded-2xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 border border-white/30 flex items-center space-x-1 whitespace-nowrap cursor-pointer"
                      onMouseEnter={() => hasSubcategories && setHoveredCategory(cat.id)}
                    >
                      <IconComponent fontSize="small" />
                      <span>{cat.name}</span>
                      {hasSubcategories && <span className="ml-1 text-xs">▼</span>}
                    </div>
                    {hasSubcategories && hoveredCategory === cat.id && (
                      <div className="absolute top-full left-0 bg-white rounded-xl shadow-2xl border-2 border-blue-500 py-2 min-w-[200px] z-[9999]" style={{display: 'block'}}>
                        <Link
                          to={`/category/${cat.name}`}
                          className="block px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b"
                        >
                          All {cat.name}
                        </Link>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/category/${sub.name}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                to="/deals"
                className="bg-gradient-to-r from-red-500/80 to-orange-500/80 backdrop-blur-lg text-white px-4 py-2 rounded-2xl text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-white/30 flex items-center space-x-1"
              >
                <LocalFireDepartmentIcon fontSize="small" />
                <span>Hot Deals</span>
              </Link>
            </div>

            {/* Right Buttons */}
            <div className="flex space-x-3">
              <Link
                to="/about"
                className="bg-white/60 backdrop-blur-lg text-gray-700 hover:text-blue-600 px-4 py-2 rounded-2xl text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-white/30 flex items-center space-x-1"
              >
                <InfoIcon fontSize="small" />
                <span>About</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>



      {/* Overlay to close sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`w-72 bg-white/90 backdrop-blur-xl border-r border-white/20 h-full fixed left-0 top-28 bottom-0 overflow-y-auto shadow-2xl z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Categories</h3>
            <nav className="space-y-1">
              {categories.map((cat) => {
                const IconComponent = getCategoryIcon(cat.name);
                const path = `/category/${cat.name}`;
                return (
                  <div key={cat.id}>
                    <Link
                      to={path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isActive(path)
                          ? 'bg-blue-500/20 backdrop-blur-lg text-blue-600 font-medium shadow-lg'
                          : 'text-gray-700 hover:bg-white/50 hover:backdrop-blur-lg hover:text-blue-600 hover:shadow-md'
                      } transform hover:translate-x-2`}
                    >
                      <IconComponent className="mr-3" />
                      <span>{cat.name}</span>
                    </Link>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="ml-8 mt-1 space-y-1">
                        {cat.subcategories.map((sub) => {
                          const subPath = `/category/${sub.name}`;
                          return (
                            <Link
                              key={sub.id}
                              to={subPath}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`flex items-center px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                                isActive(subPath)
                                  ? 'bg-blue-500/10 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                              }`}
                            >
                              <span>• {sub.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* User Menu */}
          {user && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">My Account</h3>
              <nav className="space-y-1">
                {userMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-blue-500/20 backdrop-blur-lg text-blue-600 font-medium shadow-lg'
                          : 'text-gray-700 hover:bg-white/50 hover:backdrop-blur-lg hover:text-blue-600 hover:shadow-md'
                      } transform hover:translate-x-2`}
                    >
                      <IconComponent className="mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Links</h3>
            <nav className="space-y-1">
              <Link
                to="/deals"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-4 py-3 rounded-2xl text-red-600 hover:bg-red-500/10 hover:backdrop-blur-lg hover:shadow-md transition-all duration-200 transform hover:translate-x-2"
              >
                <LocalFireDepartmentIcon className="mr-3" />
                <span className="font-medium">Hot Deals</span>
              </Link>
              <Link
                to="/discounted"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-4 py-3 rounded-2xl text-orange-600 hover:bg-orange-500/10 hover:backdrop-blur-lg hover:shadow-md transition-all duration-200 transform hover:translate-x-2"
              >
                <LocalFireDepartmentIcon className="mr-3" />
                <span className="font-medium">Discounted</span>
              </Link>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;