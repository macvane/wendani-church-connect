import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PublicOnlyRoute = () => {
  const { isAuthenticated, isBootstrapped, isLoading, role } = useAuth();

  if (!isBootstrapped || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (role === 'treasurer') {
      return <Navigate to="/treasurer/dashboard" replace />;
    }

    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;