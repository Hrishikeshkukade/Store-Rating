import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UpdatePassword from './pages/UpdatePassword';
import StoreList from './pages/StoreList';
import StoreDetail from './pages/StoreDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUserList from './pages/admin/UserList';
import AdminStoreList from './pages/admin/StoreList';
import AdminUserForm from './pages/admin/UserForm';
import StoreOwnerDashboard from './pages/store-owner/Dashboard';
import NotFound from './pages/NotFound';
import Spinner from './components/shared/Spinner';

const App: React.FC = () => {
  const { currentUser, userData, loading, isAdmin, isStoreOwner } = useAuth();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Protected route wrapper
  const ProtectedRoute: React.FC<{ 
    element: React.ReactNode;
    allowedRoles?: Array<'admin' | 'user' | 'store_owner'>;
  }> = ({ element, allowedRoles = [] }) => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
      // Check if user has the required role
      const userRole = userData?.role;
      const hasRequiredRole = userRole && allowedRoles.includes(userRole as any);
      
      if (!hasRequiredRole) {
        // Redirect to home page if not authorized
        return <Navigate to="/" replace />;
      }
    }

    return <>{element}</>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
          <Route path="/stores" element={<StoreList />} />
          <Route path="/stores/:id" element={<StoreDetail />} />
          
          {/* Protected routes for all authenticated users */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/update-password" element={<ProtectedRoute element={<UpdatePassword />} />} />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/users" 
            element={<ProtectedRoute element={<AdminUserList />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/stores" 
            element={<ProtectedRoute element={<AdminStoreList />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/users/new" 
            element={<ProtectedRoute element={<AdminUserForm />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/users/:id" 
            element={<ProtectedRoute element={<AdminUserForm />} allowedRoles={['admin']} />} 
          />
          
          {/* Store Owner routes */}
          <Route 
            path="/store-owner/dashboard" 
            element={<ProtectedRoute element={<StoreOwnerDashboard />} allowedRoles={['store_owner']} />} 
          />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;