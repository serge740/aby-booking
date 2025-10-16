import api from '../api/api'; // your configured Axios instance with JWT support

class ReportService {
  // ✅ Create report (with optional file upload)
  async createReport(reportData, file) {
    try {
      const formData = new FormData();
      Object.entries(reportData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // If a file is attached, include it
      if (file) {
        formData.append('reportUrl', file);
      }

      const response = await api.post('/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Failed to create report';
      throw new Error(msg);
    }
  }

  // ✅ Get all reports
  async getAllReports() {
    try {
      const response = await api.get('/report');
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Failed to fetch reports';
      throw new Error(msg);
    }
  }

  // ✅ Get one report by ID
  async getReportById(id) {
    try {
      const response = await api.get(`/report/${id}`);
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Failed to fetch report';
      throw new Error(msg);
    }
  }

  // ✅ Update report (supports optional new file upload)
  async updateReport(id, updatedData, file) {
    try {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      if (file) {
        formData.append('reportUrl', file);
      }

      const response = await api.put(`/report/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Failed to update report';
      throw new Error(msg);
    }
  }

  // ✅ Delete report
  async deleteReport(id) {
    try {
      const response = await api.delete(`/report/${id}`);
      return response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || 'Failed to delete report';
      throw new Error(msg);
    }
  }
}

const reportService = new ReportService();
export default reportService;

// Optional named exports
export const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} = reportService;
