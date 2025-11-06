import React from 'react';
import { auth } from '../../config/firebase';

const Homepage = ({ user }) => {
  const handleLogout = () => {
    auth.signOut();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">GadgetBazar</h1>
            <nav className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.displayName || user.email}!</span>
                  <a href="/profile" className="text-gray-700 hover:text-blue-600">My Profile</a>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <a href="/login" className="text-gray-700 hover:text-blue-600">Login</a>
                  <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</a>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Welcome to GadgetBazar</h1>
            <p className="text-xl mb-6">Discover the latest electronics and gadgets at unbeatable prices</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Shop Now
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Power Bank', 'Wearables', 'Headphones', 'Smartphones', 'Laptops', 'Accessories'].map(category => (
              <div key={category} className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full"></div>
                <h3 className="font-semibold text-gray-800">{category}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Wireless Power Bank 20000mAh', price: 'BDT 2,500' },
              { name: 'Smart Watch Pro', price: 'BDT 8,500' },
              { name: 'Bluetooth Headphones', price: 'BDT 1,800' },
              { name: 'Gaming Mouse RGB', price: 'BDT 1,200' }
            ].map(product => (
              <div key={product.name} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{product.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;