/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/adminAuthService';

export const AdminAuthContext = createContext({
  user: null,
  login: async () => ({}),
  logout: async () => {},
  updateProfile: async () => ({}),
  isAuthenticated: false,
  isLoading: true,
});

export const AdminAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthState = (authData) => {
    setUser(authData.user);
    setIsAuthenticated(authData.isAuthenticated);
  };

  const login = async (data) => {
    try {
      console.log(data);
      const response = await authService.login(data);

      updateAuthState({
        user: response,
        isAuthenticated: true,
      });

      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      const response = await authService.logout();
      updateAuthState({ user: null, isAuthenticated: false });
      return response;
    } catch (error) {
      updateAuthState({ user: null, isAuthenticated: false });
      throw new Error(error.message);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      updateAuthState({
        user: updatedUser,
        isAuthenticated: true,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const userProfile = await authService.getProfile();

      if (userProfile) {
        updateAuthState({
          user: userProfile,
          isAuthenticated: true,
        });
      } else {
        updateAuthState({ user: null, isAuthenticated: false });
      }
    } catch {
      updateAuthState({ user: null, isAuthenticated: false });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Always verify session with backend (cookie is sent automatically)
    checkAuthStatus();
  }, []);

  const values = {
    login,
    logout,
    updateProfile,
    user,
    isLoading,
    isAuthenticated,
  };

  return (
    <AdminAuthContext.Provider value={values}>{children}</AdminAuthContext.Provider>
  );
};

export default function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthContextProvider');
  }
  return context;
}
