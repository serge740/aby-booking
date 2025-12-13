import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEmployeeAuth } from '../../context/EmployeeAuthContext';

interface ProtectPrivateEmployeeRouteProps {
  children: ReactNode;
}

// ==========================================
// CENTRALIZED PERMISSION CONFIGURATION
// ==========================================
/**
 * Maps route paths to required permissions (array)
 * Employee must have AT LEAST ONE of the permissions in the array
 * ONLY define routes that REQUIRE permissions
 * Routes not listed here are accessible to all employees
 */
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/employee/dashboard/stock': ['stock_management'],
  '/employee/dashboard/menu-item': ['menu_management'],
  '/employee/dashboard/requisition-management': ['requisition_management'],
};

const ProtectPrivateEmployeeRoute: React.FC<ProtectPrivateEmployeeRouteProps> = ({ children }) => {
  const { isAuthenticated, isLocked, isLoading, user } = useEmployeeAuth();
  const location = useLocation();

  // Check if the current route requires specific permissions
  const checkPermission = () => {
    const currentPath = location.pathname;

    // Find if current path matches any protected route
    const matchedRoute = Object.keys(ROUTE_PERMISSIONS).find(route =>
      currentPath.includes(route) || currentPath === route
    );

    if (!matchedRoute) {
      // Route doesn't require permission, allow access
      return true;
    }

    const requiredPermissions = ROUTE_PERMISSIONS[matchedRoute];

    // Check if user has permissions
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }

    // Extract permission names from user's permissions
    const userPermissionNames = user.permissions.map((p: any) => 
      p.permission?.name || p.name
    ).filter(Boolean);

    // Check if user has ANY of the required permissions for this route
    return requiredPermissions.some(requiredPermission =>
      userPermissionNames.includes(requiredPermission)
    );
  };

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

  // 🛡️ Check permissions and redirect to dashboard if not authorized
  if (!checkPermission()) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  // ✅ Authorized, unlocked, and has required permissions — show page content
  return <>{children}</>;
};

export default ProtectPrivateEmployeeRoute;

// ==========================================
// EXPORT PERMISSION CONFIG for use elsewhere
// ==========================================
export { ROUTE_PERMISSIONS };