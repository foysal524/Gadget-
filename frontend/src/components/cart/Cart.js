import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { getGuestCart, updateGuestCartItem, removeFromGuestCart } from '../../utils/guestCart';

const Cart = ({ user }) => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      fetchGuestCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await apiCall('/api/cart');
      setCart(res.data.cart);
      refreshCart();
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestCart = async () => {
    try {
      const guestItems = getGuestCart();
      const itemsWithProducts = await Promise.all(guestItems.map(async (item) => {
        const res = await fetch(`http://localhost:8000/api/products/${item.productId}`);
        const data = await res.json();
        const stockQty = item.variation ? item.variation.stock : data.data.product.stockQuantity;
        return {
          id: item.productId + JSON.stringify(item.variation),
          productId: item.productId,
          quantity: item.quantity,
          variation: item.variation,
          product: {
            id: data.data.product.id,
            name: data.data.product.name,
            price: item.variation?.price || data.data.product.price,
            image: data.data.product.images[0],
            inStock: data.data.product.inStock,
            stockQuantity: stockQty
          }
        };
      }));
      const totalItems = itemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = itemsWithProducts.reduce((sum, item) => {
        const price = item.variation?.price || item.product.price;
        return sum + (price * item.quantity);
      }, 0);
      setCart({ items: itemsWithProducts, totalItems, totalAmount });
    } catch (error) {
      console.error('Error fetching guest cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity, maxStock) => {
    if (quantity < 1 || quantity > maxStock) return;
    if (!user) {
      updateGuestCartItem(itemId, quantity);
      fetchGuestCart();
      refreshCart();
      return;
    }
    try {
      await apiCall(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      fetchCart();
    } catch (error) {
      alert('Error updating cart');
    }
  };

  const removeItem = async (itemId) => {
    if (!user) {
      removeFromGuestCart(itemId);
      fetchGuestCart();
      refreshCart();
      return;
    }
    try {
      await apiCall(`/api/cart/items/${itemId}`, { method: 'DELETE' });
      fetchCart();
    } catch (error) {
      alert('Error removing item');
    }
  };



  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cart.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b">
                  <img src={item.product.image || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    {item.variation && (
                      <p className="text-sm text-gray-600">
                        {item.variation.color}
                        {item.variation.ram && ` | ${item.variation.ram}`}
                        {item.variation.rom && ` | ${item.variation.rom}`}
                      </p>
                    )}
                    <p className="text-blue-600 font-bold">৳{(item.variation?.price || item.product.price).toLocaleString()}</p>
                    {!item.product.inStock && <p className="text-red-600 text-sm">Out of stock</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.product.stockQuantity)} className="px-3 py-1 border rounded">-</button>
                    <span className="px-4">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.product.stockQuantity)} className="px-3 py-1 border rounded" disabled={item.quantity >= item.product.stockQuantity}>+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">৳{((item.variation?.price || item.product.price) * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Items ({cart.totalItems})</span>
                  <span>৳{cart.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>৳100</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>৳{(cart.totalAmount + 100).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => user ? navigate('/checkout') : navigate('/login')} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
