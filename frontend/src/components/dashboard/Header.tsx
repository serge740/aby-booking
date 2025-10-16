import {
  Bell,
  LogOut,
  Menu,
  Settings,
  User,
  Lock,
  ChevronDown,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminAuth from "../../context/AdminAuthContext";

import { API_URL } from "../../api/api";

interface HeaderProps {
  onToggle: () => void;
  role: string;
}

const useEmployeeAuth = ()=>{
  return{
    user:{},
    logout:()=>{},
    lockEmployee:()=>{}
  }
}
const Header: React.FC<HeaderProps> = ({ onToggle}) => {
  const role = 'admin'
  const navigate = useNavigate();
  const { user: adminUser, logout: adminLogout, lockAdmin } = useAdminAuth();
  const { user: employeeUser, logout: employeeLogout, lockEmployee } = useEmployeeAuth();

  // Use the appropriate user and logout function based on role
  const user = role === "admin" ? adminUser : employeeUser;
  const logout = role === "admin" ? adminLogout : employeeLogout;
  const lock = role === "admin" ? lockAdmin : lockEmployee;

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);



  const onLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
   
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLock = async () => {
    setIsLocking(true);
    try {
      await lock();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Lock error:", error);
    } finally {
      setIsLocking(false);
    }
  };

  // Get display name based on role
  const getDisplayName = (): string => {
    if (role === "admin") {
      return adminUser?.adminName || "Admin";
    }
    return employeeUser?.first_name
      ? `${employeeUser.first_name} ${employeeUser.last_name || ""}`.trim()
      : "Employee";
  };

  // Get profile image and email based on role
  const getProfileImage = (): string | undefined => {
    return role === "admin" ? adminUser?.profileImage : employeeUser?.profile_image ;
  };

  const getEmail = (): string | undefined => {
    return role === "admin" ? adminUser?.adminEmail : employeeUser?.email;
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

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-3">
        <div className="flex md:items-center flex-wrap justify-center gap-3 md:gap-0 md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 bg-primary-600 rounded-lg lg:hidden flex items-center justify-center cursor-pointer"
                onClick={onToggle}
              >
                <Menu className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome to Dashboard Management
              </h1>
            </div>
          </div>

          <div className="flex md:items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLocking}
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                  {getProfileImage() ? (
                    <img
                      src={`${API_URL}${getProfileImage()}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-700">{getDisplayName()}</div>
                  <div className="text-xs text-primary-600">{role === "admin" ? "Administrator" : "Employee"}</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-primary-50">
                      <div className="text-sm font-medium text-gray-900">{getDisplayName()}</div>
                      <div className="text-xs text-gray-600">{getEmail()}</div>
                      <div className="text-xs font-medium text-primary-600">
                        {role === "admin" ? "Administrator" : "Employee"}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate(role === "admin" ? "/admin/dashboard/profile" : "/employee/dashboard/profile");
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          handleLock();
                          setIsDropdownOpen(false);
                        }}
                        disabled={isLocking}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {isLocking ? "Locking..." : "Lock Screen"}
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          onLogout();
                          setIsDropdownOpen(false);
                        }}
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