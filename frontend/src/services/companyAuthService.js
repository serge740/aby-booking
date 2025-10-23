import api from '../api/api'; // your configured Axios instance (with baseURL + withCredentials)

class CompanyAuthService {
  // ✅ REGISTER COMPANY
  async registerCompany(companyData) {
    try {
      const response = await api.post('/company-auth/register', companyData);
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to register company';
      throw new Error(msg);
    }
  }

  // ✅ LOGIN COMPANY (sets JWT cookie)
  async loginCompany(credentials) {
    try {
      const response = await api.post('/company-auth/login', credentials, {
        withCredentials: true, // ensure cookie is sent
      });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Login failed';
      throw new Error(msg);
    }
  }

  // ✅ LOGOUT COMPANY (clears cookie)
  async logoutCompany() {
    try {
      const response = await api.post('/company-auth/logout', {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Logout failed';
      throw new Error(msg);
    }
  }

  // ✅ GET COMPANY PROFILE (requires auth cookie)
  async getProfile() {
    try {
      const response = await api.get('/company-auth/profile', {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch company profile';
      throw new Error(msg);
    }
  }

  // ✅ EDIT COMPANY PROFILE (optional new logo)
  async editProfile(updatedData, logoFile) {
    try {
      const formData = new FormData();

      // Append fields
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append logo file if provided
      if (logoFile) {
        formData.append('companyLogo', logoFile);
      }

      const response = await api.put('/company-auth/edit-profile/'+updatedData.id, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to edit profile';
      throw new Error(msg);
    }
  }
}

const companyAuthService = new CompanyAuthService();
export default companyAuthService;

// Optional named exports
export const {
  registerCompany,
  loginCompany,
  logoutCompany,
  getProfile,
  editProfile,
} = companyAuthService;
