import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  User,
  X,
  Building,
  ShoppingBag,
  PackageSearch,
  ClipboardList,
  History,
  Users,
  Settings,
  ChevronDown,
  File,
  MapPin,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import useAdminAuth from "../../context/AdminAuthContext";
import { useCompanyAuth } from "../../context/CompanyAuthContext";
import logo from '../../assets/tran.png';

interface SidebarProps {
  isOpen?: boolean;
  onToggle: () => void;
  role: "admin" | "company"; // Explicit
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  allowedRoles?: string[];
}

interface DropdownGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle, role }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth contexts
  const adminAuth = useAdminAuth();
  const companyAuth = useCompanyAuth();

  // Select correct auth and user
  const auth = role === "admin" ? adminAuth : companyAuth;
  const user = role === "admin" ? adminAuth.user : companyAuth.company;

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // Unified navigation with role-based access
  const getNavlinks = (role: string): (NavItem | DropdownGroup)[] => {
    const basePath = `/${role}/dashboard`;

    return [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: TrendingUp,
        path: basePath,
      },
      {
        id: "company-management",
        label: "Company Management",
        icon: Building,
        path: `${basePath}/company`,
        allowedRoles: ["admin"],
      },
      {
        id: "bookings",
        label: "Bookings",
        icon: ClipboardList,
        path: `${basePath}/bookings`,
        allowedRoles: ["company", "admin"],
      },
      {
        id: "menu-category",
        label: "Menu",
        icon: ClipboardList,
     
        allowedRoles: ["company",],

        items: [
          {
            id: "menu-category",
            label: "Menu Category",
            icon: ClipboardList,
            path: `${basePath}/menu-category`,
            allowedRoles: ["company",],
          },
          {
            id: "menu-item",
            label: "Menu Item",
            icon: ClipboardList,
            path: `${basePath}/menu-item`,
            allowedRoles: ["company",],
          },
        ]
      },


    ];
  };

  // Filter items by role
  const filterNavItems = (items: (NavItem | DropdownGroup)[]): (NavItem | DropdownGroup)[] => {
    return items
      .map((item) => {
        if ("items" in item) {
          const filteredItems = item.items.filter(
            (subItem) => !subItem.allowedRoles || subItem.allowedRoles.includes(role)
          );
          if (filteredItems.length === 0) return null;
          return { ...item, items: filteredItems };
        }
        if (!item.allowedRoles || item.allowedRoles.includes(role)) {
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
      : user?.name || "Company";

  const displayEmail =
    role === "admin"
      ? user?.email || "admin@abybooking.com"
      : user?.email || "company@abybooking.com";

  const portalTitle = "Aby Booking";

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
            <img src={logo} alt="Aby Booking" className="w-10 h-10 rounded-lg" />
            <div>
              <h2 className="font-bold text-base text-primary-800">Aby Booking</h2>
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
        <div
          className="p-2 border-t border-primary-200 cursor-pointer"
          onClick={handleNavigateProfile}
        >
          <div className="flex items-center space-x-2 p-1.5 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-normal text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;