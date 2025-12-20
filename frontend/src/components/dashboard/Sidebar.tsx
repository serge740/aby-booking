import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  User,
  X,
  Building,
  ClipboardList,
  MenuSquare,
  Layers,
  Box,
  FileText,
  Calendar,
  DollarSign,
  ChevronDown,
  ExternalLink,
  Outdent,
  DoorOpen,
  File,
  BuildingIcon,
  Receipt,
  User2,
  FileQuestion,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useAdminAuth from "../../context/AdminAuthContext";
import { useCompanyAuth } from "../../context/CompanyAuthContext";
import { useEmployeeAuth } from "../../context/EmployeeAuthContext";
import logo from '../../assets/tran.png';
import PWAInstallButton from "./PWAInstallButton";

interface SidebarProps {
  isOpen?: boolean;
  onToggle: () => void;
  role: "admin" | "company" | "employee";
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  allowedRoles?: string[];
  requiredPermission?: string; // NEW: Permission required to see this link
}

interface DropdownGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
  allowedRoles?: string[];
  requiredPermission?: string; // NEW: Permission for dropdown visibility
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle, role }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth contexts
  const adminAuth = useAdminAuth();
  const companyAuth = useCompanyAuth();
  const employeeAuth = useEmployeeAuth();

  // Select correct auth and user
  const auth = role === "admin" ? adminAuth : role === "company" ? companyAuth : employeeAuth;
  const user = role === "admin" ? adminAuth.user : role === "company" ? companyAuth.company : employeeAuth.user;

  // NEW: Get employee permissions
  const employeePermissions = role === "employee" && user?.permissions 
    ? user.permissions.map((p: any) => p.permission?.name || p.name).filter(Boolean)
    : [];

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // NEW: Permission check helper
  const hasPermission = (requiredPermission?: string): boolean => {
    if (!requiredPermission) return true; // No permission required
    if (role !== "employee") return true; // Non-employees bypass permission check
    return employeePermissions.includes(requiredPermission);
  };

  // Unified navigation with role-based access
  const getNavlinks = (role: string): (NavItem | DropdownGroup)[] => {
    const basePath = `/${role}/dashboard`;

    const adminLinks: (NavItem | DropdownGroup)[] = [
      { id: "dashboard", label: "Dashboard", icon: TrendingUp, path: basePath },
      { id: "company-management", label: "Company Management", icon: Building, path: `${basePath}/company`, allowedRoles: ["admin"] },
    ];

    const companyLinks: (NavItem | DropdownGroup)[] = [
      { id: "dashboard", label: "Dashboard Summary", icon: TrendingUp, path: basePath },
      {
        id: "employee-management",
        label: "Employee Management",
        icon: User2,
        allowedRoles: ["company"],
        items: [
          { id: "employee", label: "Employee", icon: User2, path: `${basePath}/employee`, allowedRoles: ["company"] },
          { id: "permission", label: "Permissions", icon: User2, path: `${basePath}/permission-management`, allowedRoles: ["company"] },
          { id: "leave-request", label: "Leave Request Management", icon: DoorOpen, path: `${basePath}/leave-request` },
          { id: "pre-salary", label: "Pre Salary Management", icon: DollarSign, path: `${basePath}/pre-salary` },
          { id: "risk-report", label: "Risk Report Management", icon: File, path: `${basePath}/risk-report` },
        ],
      },

      { id: "orders", label: "Orders Management", icon: ClipboardList, path: `${basePath}/orders`, allowedRoles: ["company"] },
      { id: "stock", label: "Stock Management", icon: BuildingIcon, path: `${basePath}/stock` },
      { id: "request", label: "Requisition Management", icon: FileQuestion, path: `${basePath}/requisition-management`, allowedRoles: ["company"] },
      { id: "menu-item", label: "Menu Item Management", icon: Box, path: `${basePath}/menu-item`, allowedRoles: ["company"] },
      
      {
        id: "report",
        label: "Reports Management",
        icon: Receipt,
        allowedRoles: ["company"],
        items: [
          { id: "order-report", label: "Order Report", icon: Layers, path: `${basePath}/order-report`, allowedRoles: ["company"] },
        ],
      },
    ];

    // NEW: Employee links with permission requirements
    const employeeLinks: (NavItem | DropdownGroup)[] = [
      { id: "dashboard", label: "My Dashboard", icon: TrendingUp, path: basePath },
      { 
        id: "place-order", 
        label: "Order", 
        icon: DoorOpen, 
        path: `${basePath}/orders`,
      
      },
  
      { 
        id: "stock", 
        label: "Stock Management", 
        icon: BuildingIcon, 
        path: `${basePath}/stock`,
        requiredPermission: "stock_management" // Requires "stock_management" permission
      },
      { 
        id: "menu-item", 
        label: "Menu Item Management", 
        icon: Box, 
        path: `${basePath}/menu-item`,
        requiredPermission: "menu_management" // Requires "menu_management" permission
      },
      { 
        id: "request", 
        label: "Requisition", 
        icon: FileQuestion, 
        path: `${basePath}/requisition-management`,
        requiredPermission: "requisition_management" // Requires "requisition_management" permission
      },
      { 
        id: "leave-request", 
        label: "Leave Request", 
        icon: DoorOpen, 
        path: `${basePath}/leave-request`
        // No permission required - all employees can request leave
      },
      { 
        id: "pre-salary", 
        label: "Pre Salary", 
        icon: DollarSign, 
        path: `${basePath}/pre-salary`
        // No permission required - all employees can access
      },
      { 
        id: "risk-report", 
        label: "Risk Report", 
        icon: File, 
        path: `${basePath}/risk-report`
        // No permission required - all employees can report risks
      },
    ];

    return role === "admin" ? adminLinks : role === "company" ? companyLinks : employeeLinks;
  };

  // NEW: Updated filter to include permission checks
  const filterNavItems = (items: (NavItem | DropdownGroup)[]): (NavItem | DropdownGroup)[] => {
    return items
      .map((item) => {
        // Check if dropdown group
        if ("items" in item) {
          // Check role permission
          if (item.allowedRoles && !item.allowedRoles.includes(role)) return null;
          
          // Check required permission for dropdown
          if (item.requiredPermission && !hasPermission(item.requiredPermission)) return null;
          
          // Filter child items
          const filteredItems = item.items.filter((subItem) => {
            const roleAllowed = !subItem.allowedRoles || subItem.allowedRoles.includes(role);
            const permissionAllowed = hasPermission(subItem.requiredPermission);
            return roleAllowed && permissionAllowed;
          });
          
          if (filteredItems.length === 0) return null;
          return { ...item, items: filteredItems };
        }
        
        // Check single nav item
        const roleAllowed = !item.allowedRoles || item.allowedRoles.includes(role);
        const permissionAllowed = hasPermission(item.requiredPermission);
        
        if (roleAllowed && permissionAllowed) {
          return item;
        }
        return null;
      })
      .filter((item): item is NavItem | DropdownGroup => item !== null);
  };

  const navlinks = filterNavItems(getNavlinks(role));

  // Auto-open active dropdown
  useEffect(() => {
    const currentPath = location.pathname;
    for (const item of navlinks) {
      if ("items" in item) {
        const hasActiveChild = item.items.some((subItem) => currentPath.startsWith(subItem.path));
        if (hasActiveChild) {
          setOpenDropdown(item.id);
          break;
        }
      }
    }
  }, [location.pathname, navlinks]);

  const getProfileRoute = () => `/${role}/dashboard/profile`;
  const handleNavigateProfile = () => {
    navigate(getProfileRoute(), { replace: true });
  };

  // User info
  const displayName =
    role === "admin"
      ? user?.names || "Admin"
      : role === "company"
        ? user?.name || "Company"
        : `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Employee";

  const displayEmail =
    role === "admin"
      ? user?.email || "admin@abybooking.com"
      : role === "company"
        ? user?.email || "company@abybooking.com"
        : user?.email || "employee@abybooking.com";

  const portalTitle = (role ? role?.toLocaleUpperCase() : 'ABY DASH') + " PORTAL";

  const isDropdownActive = (dropdown: DropdownGroup) => {
    const currentPath = location.pathname;
    return dropdown.items.some((item) => currentPath.startsWith(item.path));
  };

  const renderMenuItem = (item: NavItem) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.id}
        to={item.path}
        end
        className={({ isActive }) =>
          `w-full flex items-center space-x-2 px-2 py-2 rounded-lg transition-all duration-200 group border-l-4 ${isActive
            ? "bg-primary-500/10 text-primary-700 border-primary-500"
            : "text-gray-700 hover:bg-gray-50 border-transparent"
          }`
        }
        onClick={() => window.innerWidth < 1024 && onToggle()}
      >
        {({ isActive }) => (
          <>
            <div className={`p-1 rounded-md ${isActive ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{item.label}</span>
          </>
        )}
      </NavLink>
    );
  };

  const renderDropdown = (dropdown: DropdownGroup) => {
    const Icon = dropdown.icon;
    const isOpen = openDropdown === dropdown.id;
    const hasActiveChild = isDropdownActive(dropdown);
    return (
      <div key={dropdown.id} className="w-full">
        <button
          onClick={() => toggleDropdown(dropdown.id)}
          className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-200 ${hasActiveChild
            ? "bg-primary-500/10 text-primary-700 border-l-4 border-primary-500"
            : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
            }`}
        >
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-md ${hasActiveChild ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{dropdown.label}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
              } ${hasActiveChild ? "text-primary-600" : "text-gray-400"}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}
        >
          <div className="ml-4 space-y-0.5 border-l-2 border-primary-100 pl-3 py-0.5">
            {dropdown.items.map((item) => {
              const SubIcon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-2 px-2 py-1.5 rounded-md transition-all duration-200 group relative ${isActive
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full -ml-3"></div>
                      )}
                      <SubIcon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 min-h-screen bg-white flex flex-col border-r border-primary-200 shadow-lg transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } w-72`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-primary-200">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="ABY DASH" className="w-10 h-10 rounded-lg" />
            <div>
              <h2 className="font-bold text-base text-primary-800">ABY DASH</h2>
              <p className="text-xs text-primary-500">{portalTitle}</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-0.5">
            {navlinks.length > 0 ? (
              navlinks.map((item) =>
                "items" in item ? renderDropdown(item) : renderMenuItem(item)
              )
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-xs">No menu items available</p>
              </div>
            )}
          </nav>
        </div>
     

        {/* Footer: Profile */}
        <PWAInstallButton />
      </div>
    </>
  );
};

export default Sidebar;