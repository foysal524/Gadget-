import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { adminAuth } from '../../config/adminFirebase';
import { adminApiCall } from '../../utils/adminApi';

const AdminProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(adminAuth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      try {
        await adminApiCall('/api/user/profile');
        setIsAdmin(true);
      } catch (error) {
        setIsAdmin(false);
      }
      setChecking(false);
    };

    if (!loading) {
      checkAdminRole();
    }
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminProtectedRoute;