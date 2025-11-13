import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import { CartProvider, useCart } from './context/CartContext';
import Layout from './components/layout/Layout';
import Homepage from './components/home/Homepage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/profile/Profile';
import ProductDetail from './components/product/ProductDetail';
import ProductCatalog from './components/catalog/ProductCatalog';
import SearchResults from './components/catalog/SearchResults';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductManagement from './components/admin/ProductManagement';
import OrderManagement from './components/admin/OrderManagement';
import CategoryManagement from './components/admin/CategoryManagement';
import AdminLogin from './components/auth/AdminLogin';
import AdminSignup from './components/auth/AdminSignup';
import AdminProfile from './components/admin/AdminProfile';
import RestockRequests from './components/admin/RestockRequests';
import AdminNotifications from './components/admin/AdminNotifications';
import AdminChat from './components/admin/AdminChat';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import CartMergeModal from './components/cart/CartMergeModal';
import Notifications from './components/notifications/Notifications';
import About from './components/about/About';

function AppContent() {
  const [user, loading] = useAuthState(auth);
  const { showMergeModal, cartConflict, handleMergeChoice, closeMergeModal } = useCart();
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {!isAdminRoute && showMergeModal && cartConflict && (
        <CartMergeModal
          savedCount={cartConflict.savedCount}
          guestCount={cartConflict.guestCount}
          onChoice={handleMergeChoice}
          onClose={closeMergeModal}
        />
      )}
      <Router>
        <div className="App">
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          
          {/* Admin auth routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          {/* Admin panel routes */}
          <Route path="/admin/products" element={<AdminProtectedRoute><AdminLayout><ProductManagement /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/orders" element={<AdminProtectedRoute><AdminLayout><OrderManagement /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/categories" element={<AdminProtectedRoute><AdminLayout><CategoryManagement /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/restock" element={<AdminProtectedRoute><AdminLayout><RestockRequests /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/notifications" element={<AdminProtectedRoute><AdminLayout><AdminNotifications /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/chat" element={<AdminProtectedRoute><AdminLayout><AdminChat /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/profile" element={<AdminProtectedRoute><AdminLayout><AdminProfile /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminProtectedRoute>} />
          
          {/* Main app routes with layout */}
          <Route path="/" element={<Layout><Homepage user={user} /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail user={user} /></Layout>} />
          <Route path="/profile" element={user ? <Layout><Profile user={user} /></Layout> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <Layout><Notifications user={user} /></Layout> : <Navigate to="/login" />} />
          <Route path="/cart" element={<Layout><Cart user={user} /></Layout>} />
          <Route path="/checkout" element={user ? <Layout><Checkout user={user} /></Layout> : <Navigate to="/login" />} />
          <Route path="/category/:category" element={<Layout><ProductCatalog /></Layout>} />
          <Route path="/products" element={<Layout><ProductCatalog /></Layout>} />
          <Route path="/search" element={<Layout><SearchResults /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
        </Routes>
        </div>
      </Router>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;