import React, { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';

export default function AddressBook({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    isDefault: false
  });

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await apiCall('/api/addresses');
      setAddresses(res.data?.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await apiCall(`/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiCall('/api/addresses', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowForm(false);
      setEditingAddress(null);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await apiCall(`/api/addresses/${id}`, { method: 'DELETE' });
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      label: '',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      isDefault: false
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Address Book</h1>
        <button
          onClick={() => { setShowForm(true); setEditingAddress(null); resetForm(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Address
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingAddress ? 'Edit' : 'Add'} Address</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Label (e.g., Home, Office)"
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full border p-2 rounded"
              rows="3"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                className="border p-2 rounded"
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                className="mr-2"
              />
              Set as default address
            </label>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingAddress(null); }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className={`bg-white rounded-lg shadow p-6 ${addr.isDefault ? 'border-2 border-blue-500' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{addr.label}</h3>
                {addr.isDefault && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(addr)} className="text-blue-600 hover:underline text-sm">Edit</button>
                <button onClick={() => handleDelete(addr.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
            </div>
            <p className="font-semibold">{addr.fullName}</p>
            <p className="text-gray-600">{addr.phone}</p>
            <p className="text-gray-600 mt-2">{addr.address}</p>
            <p className="text-gray-600">{addr.city} {addr.postalCode}</p>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-20">
          <p className="text-gray-500">No addresses saved</p>
        </div>
      )}
    </div>
  );
}
