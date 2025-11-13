import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { adminAuth } from '../../config/adminFirebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [user] = useAuthState(adminAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(adminAuth);
    navigate('/admin/login');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <p className="text-lg">{user?.email}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <p className="text-lg">{user?.displayName || 'Not set'}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
          <p className="text-sm text-gray-600 font-mono">{user?.uid}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <p className="text-lg">Admin</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
