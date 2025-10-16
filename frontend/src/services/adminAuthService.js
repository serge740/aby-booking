import api from '../api/api';

class AdminAuthService {
  constructor() {
    this.api = api;
  }

  async registerAdmin(adminData) {
    try {
      const response = await this.api.post('/admin/register', adminData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to register admin';
      throw new Error(msg);
    }
  }

  async adminLogin(loginData) {
    try {
      const response = await this.api.post('/admin/login', loginData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to login admin';
      throw new Error(msg);
    }
  }

  async logout() {
    try {
      const response = await this.api.post('/admin/logout');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to logout admin';
      throw new Error(msg);
    }
  }

  async getAdminProfile() {
    try {
      const response = await this.api.get('/admin/profile');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      const msg = error.response?.data?.message || error.message || 'Failed to fetch admin profile';
      throw new Error(msg);
    }
  }

  async lockAdmin() {
    try {
      const response = await this.api.post('/admin/lock');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to lock admin account';
      throw new Error(msg);
    }
  }

  async unlockAdmin(unlockData) {
    try {
      const response = await this.api.post('/admin/unlock', unlockData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to unlock admin account';
      throw new Error(msg);
    }
  }

  async findAdminByEmail(email) {
    try {
      const response = await this.api.get(`/admin/by-email/${email}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      const msg = error.response?.data?.message || error.message || 'Failed to find admin';
      throw new Error(msg);
    }
  }

  async findAdminById(id) {
    try {
      const response = await this.api.get(`/admin/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      const msg = error.response?.data?.message || error.message || 'Failed to find admin';
      throw new Error(msg);
    }
  }

  async updateAdmin(id, updateData) {
    try {
      let payload;

      if (updateData instanceof FormData) {
        payload = updateData;
      } else {
        payload = new FormData();
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            payload.append(key, value);
          }
        });
      }

      const response = await this.api.put(`/admin/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data.admin;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to update admin';
      throw new Error(msg);
    }
  }

  async deleteAdmin(id) {
    try {
      const response = await this.api.delete(`/admin/${id}`);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete admin';
      throw new Error(msg);
    }
  }

  async changePassword(data) {
    try {
      const response = await this.api.patch('/admin/change-password', data);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to change password';
      throw new Error(msg);
    }
  }

  validateAdminData(adminData) {
    const errors = [];
    if (!adminData.adminEmail) errors.push('Email is required');
    else if (!this.isValidEmail(adminData.adminEmail)) errors.push('Email format is invalid');
    if (!adminData.adminName?.trim()) errors.push('Name is required');
    if (!adminData.password) errors.push('Password is required');
    else if (adminData.password.length < 6) errors.push('Password must be at least 6 characters');
    return { isValid: errors.length === 0, errors };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

const adminAuthService = new AdminAuthService();

export default adminAuthService;
export const {
  registerAdmin,
  adminLogin,
  logout,
  getAdminProfile,
  lockAdmin,
  unlockAdmin,
  findAdminByEmail,
  findAdminById,
  validateAdminData,
  changePassword,
} = adminAuthService;
