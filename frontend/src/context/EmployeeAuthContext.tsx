import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import employeeAuthService from '../services/employeeAuthService';
import pushNotificationService, { UserTypeEnum } from '../services/pushNotificationService';
import { getClientDescription } from '../stores/detectDevice';
import { useSocket, useSocketEvent } from '../context/SocketContext';
import permissionService, { EmployeePermission } from '../services/permissionService';

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
}

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
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
  date_hired: string;
  status: EmployeeStatus;
  experience?: Record<string, any> | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  company?: Company | null;
  companyId?: string | null;
  google_id?: string | null;
  isLocked?: boolean;
  is2FA?: boolean;
  permissions?: EmployeePermission[];
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
  isSubscribedToNotifications: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  lockAccount: () => Promise<void>;
  unlockAccount: (password: string) => Promise<void>;
  updateEmployee: (formData: FormData) => Promise<Employee>;
  refreshProfile: () => Promise<void>;
  subscribeToNotifications: (label?: string) => Promise<{ success: boolean; message: string }>;
  unsubscribeFromNotifications: () => Promise<{ success: boolean; message: string }>;
  unsubscribeAllDevices: () => Promise<{ success: boolean; message: string }>;
  getSubscriptions: () => Promise<any[]>;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

export const EmployeeAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribedToNotifications, setIsSubscribedToNotifications] = useState(false);

  // Get socket connection
  const { emit, isConnected } = useSocket();

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
      setIsSubscribedToNotifications(false);
    }
  };

  // 🔧 Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };

  // 🔔 Subscribe to push notifications
  const subscribeToNotifications = async (label?: string): Promise<{ success: boolean; message: string }> => {
    if (!user?.id) {
      throw new Error('User must be logged in to subscribe');
    }

    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        throw new Error('Push notifications not supported in this browser');
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      const registration = await navigator.serviceWorker.ready;
      const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!publicVapidKey) {
        throw new Error('VAPID public key not configured');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      const subscriptionObject = subscription.toJSON();

      await pushNotificationService.subscribe(
        user.id,
        UserTypeEnum.EMPLOYEE,
        {
          id: '',
          userId: user.id,
          type: UserTypeEnum.EMPLOYEE,
          endpoint: subscriptionObject.endpoint!,
          p256dh: subscriptionObject.keys!.p256dh!,
          auth: subscriptionObject.keys!.auth!,
          label: label || `${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'} Device`,
          createdAt: new Date().toISOString(),
        } as any,
        label
      );

      setIsSubscribedToNotifications(true);

      console.log('✅ Successfully subscribed to push notifications');
      return { success: true, message: 'Successfully subscribed to notifications' };
    } catch (error: any) {
      console.error('❌ Error subscribing to notifications:', error);
      throw new Error(error.message || 'Failed to subscribe to notifications');
    }
  };

  // 🔕 Unsubscribe from push notifications (current device only)
  const unsubscribeFromNotifications = async (): Promise<{ success: boolean; message: string }> => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await pushNotificationService.unsubscribeDevice(
          user.id,
          UserTypeEnum.EMPLOYEE,
          endpoint
        );
      }

      setIsSubscribedToNotifications(false);

      console.log('✅ Successfully unsubscribed from push notifications');
      return { success: true, message: 'Successfully unsubscribed from notifications' };
    } catch (error: any) {
      console.error('❌ Error unsubscribing from notifications:', error);
      throw new Error(error.message || 'Failed to unsubscribe from notifications');
    }
  };

  // 🔕 Unsubscribe all devices
  const unsubscribeAllDevices = async (): Promise<{ success: boolean; message: string }> => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    try {
      await pushNotificationService.unsubscribeAllDevices(
        user.id,
        UserTypeEnum.EMPLOYEE
      );

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }

      setIsSubscribedToNotifications(false);

      console.log('✅ Successfully unsubscribed all devices');
      return { success: true, message: 'Successfully unsubscribed all devices' };
    } catch (error: any) {
      console.error('❌ Error unsubscribing all devices:', error);
      throw new Error(error.message || 'Failed to unsubscribe all devices');
    }
  };

  // 📋 Get all subscriptions for current user
  const getSubscriptions = async (): Promise<any[]> => {
    if (!user?.id) {
      throw new Error('User must be logged in');
    }

    try {
      const subscriptions = await pushNotificationService.getSubscriptions(
        user.id,
        UserTypeEnum.EMPLOYEE
      );
      return subscriptions;
    } catch (error: any) {
      console.error('❌ Error fetching subscriptions:', error);
      throw new Error(error.message || 'Failed to fetch subscriptions');
    }
  };

  // 🔍 Check if current device is subscribed
  const checkSubscriptionStatus = async () => {
    if (!user?.id || !isAuthenticated) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        const subscriptions = await pushNotificationService.getSubscriptions(
          user.id,
          UserTypeEnum.EMPLOYEE
        );
        
        const isSubscribed = subscriptions.some(
          (sub: any) => sub.endpoint === subscription.endpoint
        );
        
        setIsSubscribedToNotifications(isSubscribed);
      } else {
        setIsSubscribedToNotifications(false);
      }
    } catch (error) {
      console.warn('Could not check subscription status:', error);
      setIsSubscribedToNotifications(false);
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

  // 🔄 Refresh employee permissions from server
  const refreshEmployeePermissions = async () => {
    if (!user?.id) return;
    
    try {
      const permissions = await permissionService.getEmployeePermissions(user.id);
      setUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          permissions
        };
      });
      console.log('✅ Employee permissions refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh permissions:', error);
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

  // 🔌 Join company room when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.companyId && isConnected) {
      emit('joinCompanyRoom', { companyId: user.companyId });
      console.log(`🔌 Joined company room: company_${user.companyId}`);
    }
  }, [isAuthenticated, user?.companyId, isConnected, emit]);

  // 🎧 Listen for permission assigned event
  useSocketEvent('permissionAssigned', (data: any) => {
    console.log('🔔 Permission assigned event received:', data);
    
    // Check if this assignment is for the current user
    if (user?.id && data?.employeeId === user.id) {
      console.log('✅ Permission assigned to current user, refreshing permissions...');
      refreshEmployeePermissions();
      
      // Optional: Show notification to user
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Permission Assigned', {
          body: `You have been granted the "${data.permission?.name || 'permission'}" permission`,
          icon: '/notification-icon.png'
        });
      }
    }
  }, [user?.id]);

  // 🎧 Listen for permission removed event
  useSocketEvent('permissionRemoved', (data: any) => {
    console.log('🔔 Permission removed event received:', data);
    
    // Check if this removal is for the current user
    if (user?.id && data?.employeeId === user.id) {
      console.log('⚠️ Permission removed from current user, refreshing permissions...');
      refreshEmployeePermissions();
      
      // Optional: Show notification to user
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Permission Removed', {
          body: `The "${data.permission?.name || 'permission'}" permission has been removed from your account`,
          icon: '/notification-icon.png'
        });
      }
    }
  }, [user?.id]);

  // 🎧 Listen for permission created event (optional - for real-time UI updates)
  useSocketEvent('permissionCreated', (data: any) => {
    console.log('🔔 New permission created:', data);
    // You can add logic here if needed, like updating a permissions list in UI
  }, []);

  // 🔍 Check subscription status when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && user?.id) {
      checkSubscriptionStatus();
    }
  }, [isAuthenticated, isLoading, user?.id]);

  // 🔔 Auto-subscribe on login (optional)
  useEffect(() => {
    const autoSubscribe = async () => {
      if (!isAuthenticated || isLoading || !user?.id || isSubscribedToNotifications) {
        return;
      }

      const autoSubscribeEnabled = true;
      const client = getClientDescription();
      
      if (autoSubscribeEnabled) {
        try {
          await subscribeToNotifications(client.description || 'Auto-subscribed device');
        } catch (error) {
          console.warn('Auto-subscribe failed:', error);
        }
      }
    };

    autoSubscribe();
  }, [isAuthenticated, isLoading, user?.id, isSubscribedToNotifications]);

  // 🔄 Load employee permissions on authentication
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshEmployeePermissions();
    }
  }, [isAuthenticated, user?.id]);

  const value: EmployeeAuthContextType = {
    user,
    isAuthenticated,
    isLocked,
    isLoading,
    isSubscribedToNotifications,
    login,
    logout,
    changePassword,
    lockAccount,
    unlockAccount,
    updateEmployee,
    refreshProfile,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    unsubscribeAllDevices,
    getSubscriptions,
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