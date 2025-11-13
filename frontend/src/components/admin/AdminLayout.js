import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminApiCall } from '../../utils/adminApi';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await adminApiCall('/api/notifications');
      setUnreadCount(res.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/categories', label: 'Categories', icon: '📁' },
    { path: '/admin/restock', label: 'Restock Requests', icon: '🔄' },
    { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/admin/chat', label: 'Support Chat', icon: '💬' },
    { path: '/admin/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {(navItems || []).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-6 py-3 hover:bg-gray-800 ${
                location.pathname === item.path ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </div>
              {item.path === '/admin/notifications' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <Link to="/" className="block text-gray-400 hover:text-white">
            ← Back to Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
