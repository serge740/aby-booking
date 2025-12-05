import api from '../api/api'; // Your configured Axios instance

class EmployeeAuthService {
  // ✅ Employee Login
  async login(data: { identifier: string; password: string }) {
    try {
      const response = await api.post('/employee/login', data, {
        withCredentials: true, // Important to allow cookies
      });
      return response.data; // { token, twoFARequired, authenticated }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed';
      throw new Error(msg);
    }
  }

  // ✅ Get currently logged-in employee
  async getProfile() {
    try {
      const response = await api.get('/employee/profile', {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to fetch employee profile';
      throw new Error(msg);
    }
  }

  // ✅ Change password
  async changePassword(data: { currentPassword: string; newPassword: string }) {
    try {
      const response = await api.patch('/employee/change-password', data, {
        withCredentials: true,
      });
      return response.data; // { message: 'Password updated successfully' }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to change password';
      throw new Error(msg);
    }
  }

  // ✅ Logout (clears cookie)
  async logout() {
    try {
      const response = await api.post(
        '/employee/logout',
        {},
        { withCredentials: true },
      );
      return response.data; // { message: 'Logged out successfully' }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Logout failed';
      throw new Error(msg);
    }
  }

  // ✅ Lock employee account (manual trigger)
  async lockAccount() {
    try {
      const response = await api.post(
        '/employee/lock',
        {},
        { withCredentials: true },
      );
      return response.data; // { message: 'Employee has been locked.' }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to lock account';
      throw new Error(msg);
    }
  }

  // ✅ Unlock employee account (requires password)
  async unlockAccount(password: string) {
    try {
      const response = await api.post(
        '/employee/unlock',
        { password },
        { withCredentials: true },
      );
      return response.data; // { message: 'Employee unlocked successfully' }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to unlock account';
      throw new Error(msg);
    }
  }

    // ✅ Update employee (with optional file uploads)
    async updateEmployee(employeeId: string, formData: FormData) {
      try {
        const response = await api.put(`/employee/${employeeId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (error: any) {
        const msg =
          error.response?.data?.message || 'Failed to update employee';
        throw new Error(msg);
      }
    }
  
}

// ✅ Export singleton instance
const employeeAuthService = new EmployeeAuthService();
export default employeeAuthService;

// ✅ Optional named exports for easier imports
export const {
  login,
  getProfile,
  changePassword,
  logout,
  lockAccount,
  unlockAccount,
  updateEmployee,
} = employeeAuthService;
