import api from '../api/api'; // Axios instance
export interface LeaveAttachment {
  filename: string;
  url: string;
  mimeType: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  companyId: string;
  type: string; // e.g. VACATION, SICK
  status: string; // PENDING, APPROVED, REJECTED
  startDate: string; // ISO string
  endDate: string;   // ISO string
  reasonForRequest?: string;
  attachments?: LeaveAttachment[];
  approvedAt?: string | null;
  rejectedAt?: string | null;
  reasonForRejection?: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    name: string;
    email: string;
  };
}


class LeaveService {
  // Create leave request with optional attachments
  async createLeave(formData: FormData): Promise<Leave> {
    try {
      const response = await api.post('/leave', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create leave');
    }
  }

  // Get all leaves for the company
  async getAllLeaves(): Promise<Leave[]> {
    try {
      const response = await api.get('/leave');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaves');
    }
  }

  // Get single leave by ID
  async getLeaveById(leaveId: string): Promise<Leave> {
    try {
      const response = await api.get(`/leave/${leaveId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leave details');
    }
  }

  // Update leave request (with optional new attachments)
  async updateLeave(leaveId: string, formData: FormData): Promise<Leave> {
    try {
      const response = await api.put(`/leave/${leaveId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update leave');
    }
  }

  // Approve leave
  async approveLeave(leaveId: string,reason?:string): Promise<Leave> {
    try {
      const response = await api.put(`/leave/${leaveId}/approve`,{reason});
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve leave');
    }
  }

  // Reject leave with reason
  async rejectLeave(leaveId: string, reasonForRejection: string): Promise<Leave> {
    try {
      const response = await api.put(`/leave/${leaveId}/reject`, { reasonForRejection });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject leave');
    }
  }

  // Delete leave
  async deleteLeave(leaveId: string): Promise<void> {
    try {
      await api.delete(`/leave/${leaveId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete leave');
    }
  }
}

// Singleton export
const leaveService = new LeaveService();
export default leaveService;
export const {
  createLeave,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave,
} = leaveService;
