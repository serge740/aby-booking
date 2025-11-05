import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ClientAuthService, Client } from '../services/clientAuthService';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import ENV from '@/env';

interface ClientAuthContextProps {
  client: Client | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  register: (data: { name: string; email: string; phoneNumber: string; password: string }) => Promise<void>;
  login: (login: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<Client>) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextProps | undefined>(undefined);

const TOKEN_KEY = 'client_token';

interface Props {
  children: ReactNode;
}

export const ClientAuthProvider: React.FC<Props> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  const authService = new ClientAuthService();

  // -----------------------------
  // INITIALIZE AUTH STATE
  // -----------------------------
  useEffect(() => {
  const initialize = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('Loaded stored token:', storedToken);

    if (storedToken) {
      setToken(storedToken);
      try {
        await fetchProfile();
        setIsAuthenticated(true);
      } catch (err: any) {
        console.warn('Invalid or expired token, clearing...', err?.response?.status);

        // More robust error check for unauthorized
        const status = err?.response?.status || err?.status;
        if (status === 401 || status === 403) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }

        setToken(null);
        setClient(null);
        setIsAuthenticated(false);
      }
    }
  } catch (err) {
    console.error('Error initializing auth:', err);
  } finally {
    setLoading(false);
  }
};

    initialize();
  }, []);

  // -----------------------------
  // FETCH PROFILE
  // -----------------------------
  const fetchProfile = async () => {
    try {
      const result = await authService.getProfile();
      const {client}  =result
     
      
      setClient(client);
    } catch (error) {
      console.error('Fetch profile failed:', error);
      throw error;
    }
  };

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (data: { name: string; email: string; phoneNumber: string; password: string }) => {
    try {
     const result = await authService.registerClient(data);
    if(result.message){
      await login(data.email,data.password)
    }

    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  };

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (login: string, password: string) => {
    
    try {
      const result = await authService.login(login, password);
      const {client,token} = result
      setClient(client);
      setToken(token);
      setIsAuthenticated(true);
      console.log(result);
      
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // -----------------------------
  // GOOGLE LOGIN
  // -----------------------------
 const loginWithGoogle = async () => {
  setLoading(true)
  try {
    // 1. Build redirect URI
    const redirectUri = __DEV__
      ? Linking.createURL("/")
      : "abyticket://";

    const stateObj = { redirectUri, platform: "mobile" };
    const encodedState = encodeURIComponent(JSON.stringify(stateObj));
    const loginUrl = `${ENV.API_URL}/client/google?state=${encodedState}`;

    // 2. Open Google OAuth
    const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

    if (result.type !== "success" || !result.url) {
      throw new Error("Login cancelled or failed");
    }

    // 3. Extract YOUR APP TOKEN from URL
    const parsed = Linking.parse(result.url);
    const token = parsed.queryParams?.token as string;

    if (!token) {
      throw new Error("No token received from server");
    }

    // 4. Store token & fetch profile (same as normal login)
    setToken(token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);

    // Fetch user profile using the token
    await fetchProfile();
    setIsAuthenticated(true);

    // Optional: you can return token or navigate here
    // router.replace("/(dashboard)"); // if you want to navigate from provider

  } catch (error: any) {
    console.error('Google login failed:', error);
    throw error;
  }
  finally{
    setLoading(false)
  }
};

  // -----------------------------
  // GET PROFILE (EXPOSED)
  // -----------------------------
  const getProfile = async () => {
    await fetchProfile();
  };

  // -----------------------------
  // UPDATE PROFILE
  // -----------------------------
  const updateProfile = async (data: Partial<Client>) => {
    try {
      const { client } = await authService.updateClient(data);
      setClient(client);
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setClient(null);
      setToken(null);
      setIsAuthenticated(false);
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } catch (err) {
        console.error('Error clearing token:', err);
      }
    }
  };

  // -----------------------------
  // DELETE ACCOUNT
  // -----------------------------
  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      setClient(null);
      setToken(null);
      setIsAuthenticated(false);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Delete account failed:', error);
      throw error;
    }
  };

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        loginWithGoogle,
        getProfile,
        updateProfile,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = (): ClientAuthContextProps => {
  const context = useContext(ClientAuthContext);
  if (!context) throw new Error('useClientAuth must be used within a ClientAuthProvider');
  return context;
};
