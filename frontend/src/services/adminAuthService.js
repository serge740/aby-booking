/* eslint-disable no-unused-vars */
import api from '../api/api';

class AuthService {
  constructor() {
    this.api = api;
  }

  /**
   * Login user (admin or regular)
   */
  async login(loginData, isAdmin = false) {
    const response = await this.api.post(
      isAdmin ? '/auth/login' : '/auth/login',
      loginData,
      { withCredentials: true }
    );

    if (!response.data.admin) {
      throw new Error('Login failed: no user returned');
    }

    return response.data.admin;
  }

  /**
   * Get user profile
   */
  async getProfile(isAdmin = false) {
    try {
      const response = await this.api.get(
        isAdmin ? '/auth/profile' : '/auth/profile',
        { withCredentials: true }
      );

      console.log(response.data);
      return response.data; // backend returns user directly
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404)
        return null;
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates, isAdmin = false) {
    try {
      const response = await this.api.put(
        isAdmin ? '/auth/edit-profile' : '/auth/edit-profile',
        updates
      );

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        `Failed to update ${isAdmin ? 'admin' : 'user'} profile`;
      throw new Error(msg);
    }
  }

  /**
   * Change password
   */
  async changePassword(current_password, new_password) {
    try {
      const response = await this.api.put('/auth/change-password', {
        current_password,
        new_password,
      });

      return response.data.message;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to change password';
      throw new Error(msg);
    }
  }

  /**
   * Reset password (request reset link)
   */
  async resetPassword(email) {
    try {
      const response = await this.api.post('/auth/reset-password', { email });

      return response.data.message;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to reset password';
      throw new Error(msg);
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(password) {
    try {
      const response = await this.api.delete('/auth/delete-account', {
        data: { password },
      });

      return response.data.message;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete account';
      throw new Error(msg);
    }
  }

  /**
   * Logout
   */
  async logout(isAdmin = false) {
    try {
      const response = await this.api.post(
        isAdmin ? '/auth/admin/logout' : '/auth/logout',
        {}
      );

      return response.data.message;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        `Failed to logout ${isAdmin ? 'admin' : 'user'}`;
      throw new Error(msg);
    }
  }
}

const authService = new AuthService();

export default authService;

// Optional named exports for convenience
export const {
  login,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  deleteAccount,
  logout,
} = authService;
