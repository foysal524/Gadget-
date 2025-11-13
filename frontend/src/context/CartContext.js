import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { getGuestCart, getGuestCartCount, clearGuestCart } from '../utils/guestCart';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [cartCount, setCartCount] = useState(0);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [cartConflict, setCartConflict] = useState(null);

  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(getGuestCartCount());
      return;
    }
    try {
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:8000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        setCartCount(getGuestCartCount());
        return;
      }
      const data = await res.json();
      setCartCount(data.data?.cart?.totalItems || 0);
    } catch (error) {
      setCartCount(getGuestCartCount());
    }
  };

  const checkCartConflict = async () => {
    if (!user) return;
    
    const guestCart = getGuestCart();
    if (guestCart.length === 0) {
      fetchCartCount();
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:8000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        fetchCartCount();
        return;
      }
      const data = await res.json();
      const savedCart = data.data?.cart?.items || [];

      if (savedCart.length > 0 && guestCart.length > 0) {
        setCartConflict({ savedCount: savedCart.length, guestCount: guestCart.length, guestCart });
        setShowMergeModal(true);
      } else {
        if (guestCart.length > 0) {
          await handleMergeChoice('current');
        } else {
          fetchCartCount();
        }
      }
    } catch (error) {
      fetchCartCount();
    }
  };

  const handleMergeChoice = async (choice) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const guestCart = getGuestCart();
      
      console.log('Merging cart:', { guestCart, action: choice });
      
      const res = await fetch('http://localhost:8000/api/cart/merge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guestCart, action: choice })
      });

      const result = await res.json();
      console.log('Merge result:', result);

      if (result.success) {
        clearGuestCart();
        setShowMergeModal(false);
        setCartConflict(null);
        await fetchCartCount();
      } else {
        console.error('Merge failed:', result);
        alert('Failed to merge cart: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error merging cart:', error);
      alert('Error merging cart: ' + error.message);
    }
  };

  useEffect(() => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    if (isAdminRoute) {
      return;
    }
    if (user) {
      checkCartConflict();
    } else {
      fetchCartCount();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      refreshCart: fetchCartCount,
      showMergeModal,
      cartConflict,
      handleMergeChoice,
      closeMergeModal: () => setShowMergeModal(false)
    }}>
      {children}
    </CartContext.Provider>
  );
};
