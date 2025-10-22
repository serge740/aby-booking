import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAdminAuth from '../../context/AdminAuthContext';

interface ProtectPrivateAdminRouteProps {
  children: ReactNode;
}

const ProtectPrivateAdminRoute: React.FC<ProtectPrivateAdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  // Show loader while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-inter">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect only if not authenticated after loading
  if (!isAuthenticated) {
    return <Navigate to="/auth/admin/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectPrivateAdminRoute;
