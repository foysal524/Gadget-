import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">GadgetBazar</h3>
            <p className="text-gray-300 text-sm">
              Your trusted electronics marketplace in Bangladesh. Quality gadgets at the best prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white">Returns</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/smartphones" className="text-gray-300 hover:text-white">Smartphones</Link></li>
              <li><Link to="/category/laptops" className="text-gray-300 hover:text-white">Laptops</Link></li>
              <li><Link to="/category/tablets" className="text-gray-300 hover:text-white">Tablets</Link></li>
              <li><Link to="/category/accessories" className="text-gray-300 hover:text-white">Accessories</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p>📞 +880 1234-567890</p>
              <p>✉️ support@gadgetbazar.com</p>
              <p>📍 Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2025 GadgetBazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;