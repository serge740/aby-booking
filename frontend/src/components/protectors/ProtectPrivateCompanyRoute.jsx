import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCompanyAuth } from '../../context/CompanyAuthContext';

const ProtectPrivateCompanyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useCompanyAuth();
  const location = useLocation();

  // 🔹 Show loader while verifying auth
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

  // 🔹 Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/company/login" state={{ from: location }} replace />;
  }

  // 🔹 Render children if authenticated
  return <>{children}</>;
};

export default ProtectPrivateCompanyRoute;
