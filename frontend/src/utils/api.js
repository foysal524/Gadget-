import { auth } from '../config/firebase';

// Get Firebase ID token
export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// API call with authentication
export const apiCall = async (url, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
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
