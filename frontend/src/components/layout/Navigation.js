import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const categories = [
    { name: 'Smartphones', path: '/category/smartphones' },
    { name: 'Laptops', path: '/category/laptops' },
    { name: 'Tablets', path: '/category/tablets' },
    { name: 'Accessories', path: '/category/accessories' },
    { name: 'Gaming', path: '/category/gaming' },
    { name: 'Audio', path: '/category/audio' }
  ];

  return (
    <nav className="bg-gray-100 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="flex space-x-4">
            <Link
              to="/deals"
              className="text-red-600 hover:text-red-800 px-3 py-2 text-sm font-medium"
            >
              Hot Deals
            </Link>
            <Link
              to="/support"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;