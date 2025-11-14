import {
  Bell,
  LogOut,
  Menu,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAdminAuth from "../../context/AdminAuthContext";
import { useCompanyAuth } from "../../context/CompanyAuthContext";
import { useEmployeeAuth } from "../../context/EmployeeAuthContext"; // NEW
import { API_URL } from "../../api/api";
import NotificationBell from "./notification/NotificationBell";


interface HeaderProps {
  onToggle: () => void;
  role: "admin" | "company" | "employee"; // Now includes employee
}

const Header: React.FC<HeaderProps> = ({ onToggle, role }) => {
  const navigate = useNavigate();

  // Auth contexts
  const { user: adminUser, logout: adminLogout } = useAdminAuth();
  const { company, logout: companyLogout } = useCompanyAuth();
  const { user:employee, logout: employeeLogout } = useEmployeeAuth(); // NEW

  // Select correct user and logout
  const user = role === "admin" ? adminUser : role === "company" ? company : employee;
  const logout = role === "admin" ? adminLogout : role === "company" ? companyLogout : employeeLogout;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Logout handler
  const onLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      const loginPath =
        role === "admin"
          ? "/admin/login"
          : role === "company"
          ? "/company/login"
          : "/employee/login";
      navigate(loginPath, { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get display name
  const getDisplayName = (): string => {
    if (role === "admin") return adminUser?.names || "Admin";
    if (role === "company") return company?.name || "Company";
    return `${employee?.first_name || ""} ${employee?.last_name || ""}`.trim() || "Employee";
  };

  // Get profile image
  const getProfileImage = (): string | undefined => {
    if (role === "admin") return adminUser?.profileImage;
    if (role === "company") return company?.logo;
    return employee?.profile_picture || undefined;
  };

  // Get email
  const getEmail = (): string | undefined => {
    if (role === "admin") return adminUser?.email;
    if (role === "company") return company?.email;
    return employee?.email;
  };

  // Get role label
  const getRoleLabel = (): string => {
    return role === "admin" ? "Administrator" : role === "company" ? "Company" : "Employee";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };
    if (isDropdownOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isDropdownOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-3">
        <div className="flex md:items-center flex-wrap justify-center gap-3 md:gap-0 md:justify-between">
          {/* Left: Menu + Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 bg-primary-600 rounded-lg lg:hidden flex items-center justify-center cursor-pointer"
                onClick={onToggle}
              >
                <Menu className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {role === "admin"
                  ? "Admin Dashboard"
                  : role === "company"
                  ? "Company Dashboard"
                  : "Employee Portal"}
              </h1>
            </div>
          </div>

          {/* Right: Icons + Profile */}
          <div className="flex md:items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              {
              (role == 'company' || role == 'employee') ?
              <NotificationBell />

              : 

              <Bell className="w-5 h-5" />
              
            }
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                  {getProfileImage() ? (
                    <img
                      src={`${API_URL}${getProfileImage()}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling;
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  {/* Fallback Icon */}
                  <User
                    className={`w-5 h-5 text-primary-600 ${
                      getProfileImage() ? "hidden" : ""
                    }`}
                  />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-medium text-gray-700">
                    {getDisplayName()}
                  </div>
                  <div className="text-xs text-primary-600">{getRoleLabel()}</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-primary-50">
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayName()}
                      </div>
                      {getEmail() && (
                        <div className="text-xs text-gray-600 truncate">
                          {getEmail()}
                        </div>
                      )}
                      <div className="text-xs font-medium text-primary-600 mt-1">
                        {getRoleLabel()} Account
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          const profilePath =
                            role === "admin"
                              ? "/admin/dashboard/profile"
                              : role === "company"
                              ? "/company/dashboard/profile"
                              : "/employee/dashboard/profile";
                          navigate(profilePath);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </button>
                      <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;