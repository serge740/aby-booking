/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import companyAuthService from '../services/companyAuthService';

// ✅ Create context
const CompanyAuthContext = createContext({
  company: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

// ✅ Provider
export const CompanyAuthProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthState = (userData, authStatus) => {
    setCompany(userData);
    setIsAuthenticated(authStatus);
  };

  // 🔹 Register
  const register = async (data) => {
    try {
      const response = await companyAuthService.registerCompany(data);
      updateAuthState(null, false);
      return response.company;
    } catch (error) {
      throw new Error(error?.message || 'Registration failed');
    }
  };

  // 🔹 Login
  const login = async (credentials) => {
    try {
      const response = await companyAuthService.loginCompany(credentials);
      updateAuthState(response.company, true);
      return response.company;
    } catch (error) {
      throw new Error(error?.message || 'Login failed');
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await companyAuthService.logoutCompany();
      updateAuthState(null, false);
    } catch (error) {
      updateAuthState(null, false);
      throw new Error(error?.message || 'Logout failed');
    }
  };

  // 🔹 Update profile
  const updateProfile = async (updates, logoFile) => {
    try {
      const updatedCompany = await companyAuthService.editProfile({...updates,id:company.id}, logoFile);
      updateAuthState(updatedCompany, true);
      return updatedCompany;
    } catch (error) {
      throw new Error(error?.message || 'Failed to update profile');
    }
  };

  // 🔹 Check existing session (auto-login)
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const companyProfile = await companyAuthService.getProfile();
      if (companyProfile) {
        updateAuthState(companyProfile, true);
      } else {
        updateAuthState(null, false);
      }
    } catch {
      updateAuthState(null, false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    company,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    isLoading,
  };

  return (
    <CompanyAuthContext.Provider value={value}>
      {children}
    </CompanyAuthContext.Provider>
  );
};

// ✅ Hook for usage
export const useCompanyAuth = () => {
  const context = useContext(CompanyAuthContext);
  if (!context) {
    throw new Error('useCompanyAuth must be used within a CompanyAuthProvider');
  }
  return context;
};
