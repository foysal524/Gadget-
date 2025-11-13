import { adminAuth } from '../config/adminFirebase';

// Get Firebase ID token for admin
export const getAdminAuthToken = async (forceRefresh = false) => {
  const user = adminAuth.currentUser;
  if (user) {
    try {
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting admin token:', error);
      return null;
    }
  }
  return null;
};

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:8000';

// Admin API call with authentication
export const adminApiCall = async (url, options = {}) => {
  let token = await getAdminAuthToken();
  
  if (!token) {
    throw new Error('No admin authentication token available');
  }
  
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  headers['Authorization'] = `Bearer ${token}`;

  const fullUrl = url.startsWith('http') ? url : `${ADMIN_API_URL}${url}`;

  let response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // If unauthorized, try refreshing token once
  if (response.status === 401) {
    token = await getAdminAuthToken(true); // Force refresh
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(fullUrl, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    const errorMsg = errorData.error?.message || errorData.error || errorData.message || response.statusText;
    throw new Error(errorMsg);
  }

  return response.json();
};