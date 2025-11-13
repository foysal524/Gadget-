import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import { useCart } from '../../context/CartContext';

const Checkout = ({ user }) => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    paymentMethod: 'cash'
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await apiCall('/api/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await apiCall('/api/addresses');
      setAddresses(res.data?.addresses || []);
      const defaultAddr = res.data?.addresses?.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
        setFormData({
          ...formData,
          address: `${defaultAddr.address}, ${defaultAddr.city} ${defaultAddr.postalCode}`,
          phone: defaultAddr.phone
        });
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressSelect = (e) => {
    const addrId = e.target.value;
    setSelectedAddress(addrId);
    if (addrId === 'new') {
      setFormData({ ...formData, address: '', phone: '' });
    } else {
      const addr = addresses.find(a => a.id === addrId);
      if (addr) {
        setFormData({
          ...formData,
          address: `${addr.address}, ${addr.city} ${addr.postalCode}`,
          phone: addr.phone
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderRes = await apiCall('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.variation?.price || item.product.price,
            variation: item.variation
          })),
          totalAmount: cart.totalAmount + 100,
          shippingAddress: formData.address,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod
        })
      });
      
      if (formData.paymentMethod === 'sslcommerz') {
        const paymentRes = await apiCall('/api/payment/initiate', {
          method: 'POST',
          body: JSON.stringify({ orderId: orderRes.data.order.id })
        });
        window.location.href = paymentRes.data.paymentUrl;
      } else {
        refreshCart();
        alert('Order placed successfully!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order: ' + (error.message || 'Please try again'));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {addresses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">Select Saved Address</label>
                  <select
                    value={selectedAddress}
                    onChange={handleAddressSelect}
                    className="w-full border p-2 rounded"
                  >
                    <option value="new">Enter new address</option>
                    {addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} - {addr.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border p-2 rounded"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full border p-2 rounded"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="sslcommerz">SSLCommerz (Card/Mobile Banking)</option>
                  <option value="bkash">bKash</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                Place Order
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name}
                      {item.variation && ` (${item.variation.color}${item.variation.ram ? `, ${item.variation.ram}` : ''}${item.variation.rom ? `, ${item.variation.rom}` : ''})`}
                      {` x ${item.quantity}`}
                    </span>
                    <span>৳{((item.variation?.price || item.product.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
