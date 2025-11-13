import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import employeeAuthService from '../services/employeeAuthService';

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  RESIGNED = 'RESIGNED',
  PROBATION = 'PROBATION',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export interface Company {
  id: string;
  name: string;
  // Add other company fields you may need
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string; // ISO string (Date from backend)
  phone: string;
  email: string;
  password?: string | null;
  address: string;
  national_id: string;
  profile_picture?: string | null;
  bank_account_number?: string | null;
  bank_name?: string | null;
  cv?: string | null;
  application_letter?: string | null;
  position: string;

  marital_status?: MaritalStatus | null;
  date_hired: string; // ISO string
  status: EmployeeStatus;
  experience?: Record<string, any> | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;

  company?: Company | null;
  companyId?: string | null;

  google_id?: string | null;
  isLocked?: boolean;
  is2FA?: boolean;

  createdAt: string;
  updatedAt: string;
}


interface LoginData {
  identifier: string;
  password: string;
}

interface EmployeeAuthContextType {
  user: Employee | null;
  isAuthenticated: boolean;
  isLocked: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  lockAccount: () => Promise<void>;
  unlockAccount: (password: string) => Promise<void>;
  updateEmployee: (formData: FormData) => Promise<Employee>;
  refreshProfile: () => Promise<void>;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

export const EmployeeAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Update authentication state
  const updateAuthState = (userData: Employee | null) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      setIsLocked(userData.isLocked ?? false);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsLocked(false);
    }
  };

  // ✅ Login
  const login = async (data: LoginData) => {
    try {
      const res = await employeeAuthService.login(data);
      if (res.authenticated) {
        const profile = await employeeAuthService.getProfile();
        updateAuthState(profile);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await employeeAuthService.logout();
      updateAuthState(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      updateAuthState(null);
      throw new Error(error.message || 'Failed to logout');
    }
  };

  // ✅ Change password
  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      await employeeAuthService.changePassword(data);
    } catch (error: any) {
      console.error('Change password error:', error);
      throw new Error(error.message || 'Failed to change password');
    }
  };

  // ✅ Lock account
  const lockAccount = async () => {
    try {
      await employeeAuthService.lockAccount();
      setIsLocked(true);
    } catch (error: any) {
      console.error('Lock account error:', error);
      throw new Error(error.message || 'Failed to lock account');
    }
  };

  // ✅ Unlock account
  const unlockAccount = async (password: string) => {
    try {
      await employeeAuthService.unlockAccount(password);
      setIsLocked(false);
    } catch (error: any) {
      console.error('Unlock account error:', error);
      throw new Error(error.message || 'Failed to unlock account');
    }
  };

  // ✅ Update employee
  const updateEmployee = async (formData: FormData) => {
    if (!user?.id) throw new Error('No logged-in employee');
    try {
      const updated = await employeeAuthService.updateEmployee(user.id, formData);
      updateAuthState(updated);
      return updated;
    } catch (error: any) {
      console.error('Update employee error:', error);
      throw new Error(error.message || 'Failed to update employee');
    }
  };

  // ✅ Refresh profile
  const refreshProfile = async () => {
    try {
      const profile = await employeeAuthService.getProfile();
      updateAuthState(profile);
    } catch {
      updateAuthState(null);
    }
  };

  // 🧠 Auto-check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const profile = await employeeAuthService.getProfile();
        updateAuthState(profile);
      } catch (error) {
        updateAuthState(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const value: EmployeeAuthContextType = {
    user,
    isAuthenticated,
    isLocked,
    isLoading,
    login,
    logout,
    changePassword,
    lockAccount,
    unlockAccount,
    updateEmployee,
    refreshProfile,
  };

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useEmployeeAuth = () => {
  const context = useContext(EmployeeAuthContext);
  if (!context)
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider');
  return context;
};
