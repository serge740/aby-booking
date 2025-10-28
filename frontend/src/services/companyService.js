import api from '../api/api'; // your configured Axios instance with JWT headers, baseURL, etc.

class CompanyService {
  // ✅ CREATE COMPANY (with optional logo upload)
  async createCompany(companyData, logoFile) {
    try {
      const formData = new FormData();

      // Append fields manually
      Object.entries(companyData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append logo if provided
      if (logoFile) {
        formData.append('companyLogo', logoFile);
      }

      const response = await api.post('/company', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to create company';
      throw new Error(msg);
    }
  }

  // ✅ GET ALL COMPANIES
  async getAllCompanies() {
    try {
      const response = await api.get('/company');
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch companies';
      throw new Error(msg);
    }
  }

  // ✅ GET ONE COMPANY BY ID
  async getCompanyById(id) {
    try {
      const response = await api.get(`/company/${id}`);
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch company';
      throw new Error(msg);
    }
  }

  // ✅ UPDATE COMPANY (with optional new logo)
  async updateCompany(id, updatedData, logoFile) {
    try {
      const formData = new FormData();

      // Manually append each field
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // If new logo provided
      if (logoFile) {
        formData.append('companyLogo', logoFile);
      }

      const response = await api.put(`/company/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to update company';
      throw new Error(msg);
    }
  }

  // ✅ DELETE COMPANY
  async deleteCompany(id) {
    try {
      const response = await api.delete(`/company/${id}`);
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete company';
      throw new Error(msg);
    }
  }
}

const companyService = new CompanyService();
export default companyService;

// Optional named exports (for easier imports)
export const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = companyService;
