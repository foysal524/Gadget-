// Guest cart management using localStorage
export const getGuestCart = () => {
  const cart = localStorage.getItem('guestCart');
  return cart ? JSON.parse(cart) : [];
};

export const addToGuestCart = (productId, quantity = 1, variation = null) => {
  const cart = getGuestCart();
  const existingItem = cart.find(item => 
    item.productId === productId && 
    JSON.stringify(item.variation) === JSON.stringify(variation)
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity, variation });
  }
  
  localStorage.setItem('guestCart', JSON.stringify(cart));
  return cart;
};

export const updateGuestCartItem = (itemId, quantity) => {
  const cart = getGuestCart();
  const item = cart.find(item => item.productId === itemId || (item.productId + JSON.stringify(item.variation)) === itemId);
  if (item) {
    item.quantity = quantity;
  }
  localStorage.setItem('guestCart', JSON.stringify(cart));
  return cart;
};

export const removeFromGuestCart = (itemId) => {
  let cart = getGuestCart();
  cart = cart.filter(item => (item.productId + JSON.stringify(item.variation)) !== itemId && item.productId !== itemId);
  localStorage.setItem('guestCart', JSON.stringify(cart));
  return cart;
};

export const clearGuestCart = () => {
  localStorage.removeItem('guestCart');
};

export const getGuestCartCount = () => {
  const cart = getGuestCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};
