import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../utils/api';

export default function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await apiCall('/api/wishlist');
      setWishlist(res.data?.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await apiCall(`/api/wishlist/items/${itemId}`, { method: 'DELETE' });
      setWishlist(wishlist.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link to="/products" className="text-blue-600 hover:underline">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="border rounded-lg p-4 relative">
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
              <Link to={`/product/${item.productId}`}>
                <img
                  src={item.product?.images?.[0] || '/placeholder.png'}
                  alt={item.product?.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-semibold mb-2">{item.product?.name}</h3>
                <p className="text-blue-600 font-bold">৳{item.product?.price}</p>
                {!item.product?.inStock && (
                  <p className="text-red-500 text-sm mt-2">Out of Stock</p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
