import api from '../api/api'; // Axios instance

export interface RiskReportAttachment {
  filename: string;
  url: string;
  mimeType: string;
}

export interface RiskReport {
  id: string;
  employeeId: string;
  companyId: string;
  title: string;
  description: string;
  severity: string; 
  status: string;
  reason?: string | null;
  resolvedAt?: string | null;
  attachments?: RiskReportAttachment[];
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    name: string;
    email: string;
  };
}

class RiskReportService {
  // Create new risk report (with attachments)
  async createRiskReport(formData: FormData): Promise<RiskReport> {
    try {
      const res = await api.post('/risk-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create risk report');
    }
  }

  // Fetch all reports based on user type (company/employee auto handled server-side)
  async getAllRiskReports(): Promise<RiskReport[]> {
    try {
      const res = await api.get('/risk-report');
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch risk reports');
    }
  }

  // Fetch single report by ID
  async getRiskReportById(id: string): Promise<RiskReport> {
    try {
      const res = await api.get(`/risk-report/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch risk report');
    }
  }

  // Update a report with optional attachments
  async updateRiskReport(id: string, formData: FormData): Promise<RiskReport> {
    try {
      const res = await api.put(`/risk-report/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update risk report');
    }
  }

  // Mark report as resolved (company only)
  async resolveRiskReport(id: string,reason?:string): Promise<RiskReport> {
    try {
      const res = await api.put(`/risk-report/${id}/resolve`,{ reason });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resolve risk report');
    }
  }

  // Reject a report with reason (company only)
  async rejectRiskReport(id: string, reason: string): Promise<RiskReport> {
    try {
      const res = await api.put(`/risk-report/${id}/reject`, { reason });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject risk report');
    }
  }

  // Delete a report
  async deleteRiskReport(id: string): Promise<void> {
    try {
      await api.delete(`/risk-report/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete risk report');
    }
  }
}

const riskReportService = new RiskReportService();
export default riskReportService;

export const {
  createRiskReport,
  getAllRiskReports,
  getRiskReportById,
  updateRiskReport,
  resolveRiskReport,
  rejectRiskReport,
  deleteRiskReport,
} = riskReportService;
