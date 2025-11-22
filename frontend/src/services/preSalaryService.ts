import api from '../api/api'; // Axios instance

export interface PreSalary {
  id: string;
  employeeId: string;
  companyId: string;
  amount: number;
  currency: string;
  periodStart: string; // ISO string
  periodEnd: string;   // ISO string
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: string | null;
  rejectedAt?: string | null;
  reason?: string | null; // rejection reason or note
  reasonForRejection?: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

class PreSalaryService {
  // Create pre-salary request
  async createPreSalary(data: {
    employeeId?: string;
    companyId?: string;
    amount: number;
    currency?: string;
    periodStart: string | Date;
    periodEnd: string | Date;
    reason?: string;
  }): Promise<PreSalary> {
    try {
      const response = await api.post('/pre-salary', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create pre-salary');
    }
  }

  // Get all pre-salary records (company or employee)
  async getAllPreSalaries(): Promise<PreSalary[]> {
    try {
      const response = await api.get('/pre-salary');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pre-salaries');
    }
  }

  // Get single pre-salary by ID
  async getPreSalaryById(id: string): Promise<PreSalary> {
    try {
      const response = await api.get(`/pre-salary/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pre-salary');
    }
  }

  // Update pre-salary (only pending)
  async updatePreSalary(id: string, data: Partial<Omit<PreSalary, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PreSalary> {
    try {
      const response = await api.put(`/pre-salary/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update pre-salary');
    }
  }

  // Approve pre-salary (company only)
  async approvePreSalary(id: string,reason?:string): Promise<PreSalary> {
    try {
      const response = await api.put(`/pre-salary/${id}/approve`,{reason});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve pre-salary');
    }
  }

  // Reject pre-salary (company only)
  async rejectPreSalary(id: string, reason: string): Promise<PreSalary> {
    try {
      const response = await api.put(`/pre-salary/${id}/reject`, { reason });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject pre-salary');
    }
  }

  // Delete pre-salary
  async deletePreSalary(id: string): Promise<void> {
    try {
      await api.delete(`/pre-salary/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete pre-salary');
    }
  }
}

// Singleton export
const preSalaryService = new PreSalaryService();
export default preSalaryService;

export const {
  createPreSalary,
  getAllPreSalaries,
  getPreSalaryById,
  updatePreSalary,
  approvePreSalary,
  rejectPreSalary,
  deletePreSalary,
} = preSalaryService;
