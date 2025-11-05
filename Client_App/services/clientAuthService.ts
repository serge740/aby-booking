import api from '../api';
import * as SecureStore from 'expo-secure-store';

export interface Client {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  token?: string;
  status?: string;
}

const TOKEN_KEY = 'client_token';

export class ClientAuthService {
  private api = api;
  private token: string | null = null;

  constructor() {
    this.initToken();
  }

  // -----------------------------
  // INITIALIZE TOKEN
  // -----------------------------
  private async initToken() {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (storedToken) {
        this.token = storedToken;
        this.api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        console.log('Loaded client token from SecureStore:', storedToken);
      }
    } catch (error) {
      console.error('Error initializing token:', error);
    }
  }

  private async setAuthHeader(token: string | null) {
    try {
      this.token = token;
      if (token) {
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        console.log('Token saved to SecureStore:', token);
      } else {
        delete this.api.defaults.headers.common['Authorization'];
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        console.log('Token cleared from SecureStore');
      }
    } catch (error) {
      console.error('Error setting auth header:', error);
    }
  }

  // -----------------------------
  // REGISTER CLIENT
  // -----------------------------
  async registerClient(data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<{ message: string }> {
    try {
      const response = await this.api.post('/client/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Registration failed' };
    }
  }

  // -----------------------------
  // LOGIN CLIENT
  // -----------------------------
  async login(login: string, password: string): Promise<{ message: string; client: Client; token: string }> {
    try {
      const response = await this.api.post('/client/login', { login, password });
      const { token } = response.data;
      if (token) await this.setAuthHeader(token);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  // -----------------------------
  // GOOGLE LOGIN
  // -----------------------------
  async loginWithGoogle(googleToken: string): Promise<{ message: string; client: Client; token: string }> {
    try {
      // You’ll need your backend endpoint to handle this route properly:
      // (e.g. /client/google/mobile-login)
      const response = await this.api.post('/client/google', { googleToken });
      const { token } = response.data;
      if (token) await this.setAuthHeader(token);
      return response.data;
    } catch (error: any) {
      console.error('Google login error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Google login failed' };
    }
  }

  // -----------------------------
  // GET PROFILE
  // -----------------------------
  async getProfile(): Promise<{ client: Client }> {
    try {
      const response = await this.api.get('/client/profile');
      return response.data;
    } catch (error: any) {
      console.error('Profile error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  }

  // -----------------------------
  // UPDATE CLIENT INFO
  // -----------------------------
// -----------------------------
// UPDATE CLIENT INFO (with image upload support)
// -----------------------------
async updateClient(data: {
  name?: string;
  email?: string;
  phoneNumber?: string;
 
  profileImage?: any; // File | string | null
}): Promise<{ message: string; client: Client }> {
  try {
    console.log(data);
    
    const formData = new FormData();

    // Append text fields
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
  

    // Append image file only if it exists and is a File/Blob
    if (data.profileImage && typeof data.profileImage !== 'string') {
      formData.append('profileImage', {
        uri: data.profileImage.uri,
        name:
          data.profileImage.name ||
          `profile_${Date.now()}.jpg`,
        type: data.profileImage.type || 'image/jpeg',
      } as any);
    }

    const response = await this.api.patch('/client/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Update client error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Update failed' };
  }
}


  // -----------------------------
  // LOGOUT CLIENT
  // -----------------------------
  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.api.post('/client/logout');
      await this.setAuthHeader(null);
      return response.data;
    } catch (error: any) {
      console.error('Logout error:', error.response?.data || error.message);
      await this.setAuthHeader(null);
      throw error.response?.data || { message: 'Logout failed' };
    }
  }

  // -----------------------------
  // DELETE CLIENT ACCOUNT
  // -----------------------------
  async deleteAccount(): Promise<{ message: string }> {
    try {
      const response = await this.api.delete('/client/delete-account');
      await this.setAuthHeader(null);
      return response.data;
    } catch (error: any) {
      console.error('Delete account error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Delete failed' };
    }
  }
}
