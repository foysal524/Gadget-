import { auth } from '../config/firebase';

// Get Firebase ID token
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API call with authentication
export const apiCall = async (url, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    const errorMsg = errorData.error?.message || errorData.error || errorData.message || response.statusText;
    throw new Error(errorMsg);
  }

  return response.json();
};

// Example usage functions
export const getUserProfile = async () => {
  return apiCall('/api/user/profile');
};

export const updateUserProfile = async (data) => {
  return apiCall('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getProducts = async () => {
  return apiCall('/api/products');
};

export const addToCart = async (productId, quantity) => {
  return apiCall('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
};
