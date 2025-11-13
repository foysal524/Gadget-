import React, { useState, useEffect } from 'react';
import { adminApiCall } from '../../utils/adminApi';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await adminApiCall('/api/admin/orders');
      setOrders(res.data?.orders || res.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await adminApiCall(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await adminApiCall(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Order ID</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map(order => (
              <tr key={order.id} className="border-b">
                <td className="p-3 font-mono text-sm">{order.id.slice(0, 8)}</td>
                <td className="p-3">{order.user?.displayName || order.user?.email}</td>
                <td className="p-3">BDT {order.totalAmount.toLocaleString()}</td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs border ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:underline mr-2">View Details</button>
                  <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  <p className="text-sm text-gray-600">Customer</p>
                  <p>{selectedOrder.user?.displayName || selectedOrder.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{selectedOrder.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                <p className="bg-gray-50 p-3 rounded">{selectedOrder.shippingAddress}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Phone</p>
                <p>{selectedOrder.phone || selectedOrder.user?.phone || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                <p className="capitalize">{selectedOrder.paymentMethod}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Order Items</p>
                <div className="border rounded">
                  {selectedOrder.items && (typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items).map((item, idx) => (
                    <div key={idx} className="p-3 border-b last:border-b-0">
                      <div className="flex gap-4 items-start">
                        <img src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-semibold">{item.product?.name || 'Product'}</p>
                          <p className="text-xs text-gray-500 font-mono">ID: {item.productId.slice(0, 8)}...</p>
                          <p className="text-sm text-gray-600">Stock: {item.product?.stockQuantity || 0} available</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>৳{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
