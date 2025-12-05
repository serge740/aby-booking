import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {useEmployeeAuth} from '../../context/EmployeeAuthContext';

interface ProtectPrivateEmployeeRouteProps {
  children: ReactNode;
}

const ProtectPrivateEmployeeRoute: React.FC<ProtectPrivateEmployeeRouteProps> = ({ children }) => {
  const { isAuthenticated, isLocked, isLoading } = useEmployeeAuth();
  const location = useLocation();

  // 🔄 Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // 🚫 Redirect unauthenticated employees to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/employee/login" state={{ from: location }} replace />;
  }

  // 🔒 Redirect locked employees to unlock page
  if (isLocked) {
    return <Navigate to="/auth/employee/unlock" state={{ from: location }} replace />;
  }

  // ✅ Authorized and unlocked — show page content
  return <>{children}</>;
};

export default ProtectPrivateEmployeeRoute;
