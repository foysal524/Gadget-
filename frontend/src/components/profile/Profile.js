import React, { useState, useEffect } from 'react';
import { updateProfile, updatePassword, updateEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { apiCall } from '../../utils/api';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await apiCall('/api/orders');
      setOrders(res.data?.orders || res.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await apiCall(`/api/orders/${orderId}`, { method: 'DELETE' });
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }
      
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await updatePassword(user, formData.newPassword);
      }

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 animate-scale-in border border-white/30">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-green-600/90 backdrop-blur-lg text-white px-6 py-2 rounded-2xl hover:bg-green-700 transform hover:scale-105 transition-all duration-200 hover:shadow-xl border border-white/20"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-gray-900">{user.displayName || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-gray-900">{new Date(user.metadata.creationTime).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
                <p className="mt-1 text-gray-900">{new Date(user.metadata.lastSignInTime).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Activity Section */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 mt-6 hover:shadow-2xl transition-shadow duration-300 animate-slide-up border border-white/30">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50/60 backdrop-blur-lg p-4 rounded-2xl hover-lift cursor-pointer group border border-blue-100/50">
              <h3 className="font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">Orders</h3>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-sm text-blue-700">Total orders placed</p>
            </div>
            
            <div className="bg-green-50/60 backdrop-blur-lg p-4 rounded-2xl hover-lift cursor-pointer group border border-green-100/50">
              <h3 className="font-semibold text-green-900 group-hover:text-green-700 transition-colors">Wishlist</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-green-700">Items in wishlist</p>
            </div>
            
            <div className="bg-purple-50/60 backdrop-blur-lg p-4 rounded-2xl hover-lift cursor-pointer group border border-purple-100/50">
              <h3 className="font-semibold text-purple-900 group-hover:text-purple-700 transition-colors">Reviews</h3>
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-purple-700">Products reviewed</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 mt-6 hover:shadow-2xl transition-shadow duration-300 animate-slide-up border border-white/30" style={{animationDelay: '0.2s'}}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-600 mb-2">৳{order.totalAmount.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline text-sm">
                      View Details
                    </button>
                    <button onClick={() => handleDeleteOrder(order.id)} className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 mt-6 hover:shadow-2xl transition-shadow duration-300 animate-slide-up border border-white/30" style={{animationDelay: '0.3s'}}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <button onClick={() => window.location.href = '/wishlist'} className="bg-green-600/90 backdrop-blur-lg text-white p-4 rounded-2xl hover:bg-green-700 text-left transform hover:scale-105 hover:shadow-xl transition-all duration-200 border border-white/20">
              <h3 className="font-semibold">My Wishlist</h3>
              <p className="text-sm opacity-90">View saved products</p>
            </button>
            
            <button onClick={() => window.location.href = '/address-book'} className="bg-purple-600/90 backdrop-blur-lg text-white p-4 rounded-2xl hover:bg-purple-700 text-left transform hover:scale-105 hover:shadow-xl transition-all duration-200 border border-white/20">
              <h3 className="font-semibold">Address Book</h3>
              <p className="text-sm opacity-90">Manage shipping addresses</p>
            </button>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono text-sm">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold capitalize">{selectedOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="capitalize">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                  <p className="bg-gray-50 p-3 rounded">{selectedOrder.shippingAddress}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Order Items</p>
                  <div className="border rounded">
                    {selectedOrder.items && (typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items).map((item, idx) => (
                      <div key={idx} className="p-3 border-b last:border-b-0">
                        <div className="flex gap-4 items-start">
                          <img src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-semibold">{item.product?.name || 'Product'}</p>
                            <p className="text-xs text-gray-500 font-mono">ID: {item.productId.slice(0, 8)}...</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">৳{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total Amount</span>
                    <span>৳{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <button onClick={() => handleDeleteOrder(selectedOrder.id)} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;