// src/components/auth/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  redirectPath?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ redirectPath = '/login' }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Check if user is authenticated and is an admin
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check admin status
  const isAdmin = user.isAdmin || user.user_metadata?.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the protected route
  return <Outlet />;
};

export default AdminRoute;
