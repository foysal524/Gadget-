import React, { useState, useEffect } from 'react';
import { adminApiCall } from '../../utils/adminApi';

const RestockRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await adminApiCall('/api/restock/requests');
      setRequests(res.data?.requests || res.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminApiCall(`/api/restock/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      fetchRequests();
      alert('Status updated');
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Restock Requests</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Variation</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(requests || []).map(req => (
              <tr key={req.id} className="border-b">
                <td className="p-3">{req.product.name}</td>
                <td className="p-3">{req.variation ? `${req.variation.color}${req.variation.ram ? `, ${req.variation.ram}` : ''}` : '-'}</td>
                <td className="p-3">{req.user.displayName || req.user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    req.status === 'restocked' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(req.id, 'restocked')}
                      className="text-green-600 hover:underline mr-2"
                    >
                      Mark Restocked
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestockRequests;
