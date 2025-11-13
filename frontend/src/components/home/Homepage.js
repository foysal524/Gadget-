import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import { useCart } from '../../context/CartContext';

const Homepage = ({ user }) => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    if (!user) {
      const { addToGuestCart } = await import('../../utils/guestCart');
      addToGuestCart(productId, 1);
      refreshCart();
      alert('Added to cart!');
      return;
    }
    try {
      await apiCall('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 })
      });
      refreshCart();
      alert('Added to cart!');
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          apiCall('/api/products?limit=8'),
          apiCall('/api/categories')
        ]);
        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
        
        // Get discounted products
        const allProducts = await apiCall('/api/products?limit=100');
        const discounted = allProducts.data.products.filter(product => 
          product.originalPrice && product.originalPrice > product.price
        ).slice(0, 4);
        setDiscountedProducts(discounted);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <main className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
        <section className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl rounded-3xl text-white p-8 mb-12 animate-slide-up overflow-hidden relative shadow-2xl border border-white/20">
          <div className="max-w-2xl relative z-10">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">Welcome to GadgetBazar</h1>
            <p className="text-xl mb-6 animate-fade-in" style={{animationDelay: '0.2s'}}>Discover the latest electronics and gadgets at unbeatable prices</p>
            <button className="bg-white/90 backdrop-blur-lg text-blue-600 px-6 py-3 rounded-2xl font-semibold hover:bg-white transform hover:scale-105 hover:shadow-xl transition-all duration-300">
              Shop Now
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 animate-pulse"></div>
        </section>

        {/* Discounted Products */}
        {discountedProducts.length > 0 && (
          <section className="mb-12 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🔥 Discounted Products</h2>
              <button onClick={() => navigate('/discounted')} className="text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {discountedProducts.map((product, index) => (
                <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden hover-lift group animate-scale-in border border-white/30 cursor-pointer relative" style={{animationDelay: `${index * 0.15}s`}}>
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                  <div className="h-48 bg-gradient-to-br from-gray-100/80 to-gray-200/80 group-hover:from-blue-50/80 group-hover:to-purple-50/80 transition-all duration-500 flex items-center justify-center">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-blue-600">BDT {product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-400 line-through ml-2">BDT {product.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={!product.inStock}
                      className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden hover-lift group animate-scale-in border border-white/30 cursor-pointer" style={{animationDelay: `${index * 0.15}s`}}>
                  <div className="h-48 bg-gradient-to-br from-gray-100/80 to-gray-200/80 group-hover:from-blue-50/80 group-hover:to-purple-50/80 transition-all duration-500 flex items-center justify-center">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-blue-600">BDT {product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">BDT {product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">⭐ {product.rating} ({product.reviewCount})</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={!product.inStock}
                      className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
      </main>
    </div>
  );
};

export default Homepage;