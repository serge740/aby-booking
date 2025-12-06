import api from "../api/api";

export interface RequisitionItem {
  id?: string;
  itemName: string;
  quantity: number;
  unit?: string;
  purpose?: string;
  note?: string;
  stockId?: string | null;
  remove?: boolean; // for editing
}

export interface Requisition {
  id: string;
  employeeId: string;
  companyId: string;
  description?: string | null;
  status: string;
  rejectReason?: string | null;
  createdAt: string;
  updatedAt: string;

  items: RequisitionItem[];

  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };

  company?: {
    id: string;
    name: string;
  };
}

class RequisitionService {
  // ───────────────────────────────────
  // CREATE REQUISITION
  // ───────────────────────────────────
  async createRequisition(payload: {
    description?: string;
    items: RequisitionItem[];
    companyId?: string;
  }): Promise<Requisition> {
    try {
      const res = await api.post("/requisition", payload);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create requisition"
      );
    }
  }

  // ───────────────────────────────────
  // GET ALL (company or employee automatically)
  // ───────────────────────────────────
  async getRequisitions(): Promise<Requisition[]> {
    try {
      const res = await api.get("/requisition");
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch requisitions"
      );
    }
  }

  // ───────────────────────────────────
  // GET ONE BY ID
  // ───────────────────────────────────
  async getRequisitionById(id: string): Promise<Requisition> {
    try {
      const res = await api.get(`/requisition/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch requisition");
    }
  }

  // ───────────────────────────────────
  // UPDATE PENDING REQUISITION (Employee)
  // ───────────────────────────────────
  async updateRequisition(id: string, payload: any): Promise<Requisition> {
    try {
      const res = await api.put(`/requisition/${id}`, payload);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to update requisition"
      );
    }
  }

  // ───────────────────────────────────
  // APPROVE (Company/Admin)
  // ───────────────────────────────────
  async approveRequisition(id: string, items: RequisitionItem[]): Promise<Requisition> {
    try {
      const res = await api.put(`/requisition/${id}/approve`, { items });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to approve requisition");
    }
  }

  // ───────────────────────────────────
  // REJECT (Company/Admin)
  // ───────────────────────────────────
  async rejectRequisition(id: string, reason: string): Promise<Requisition> {
    try {
      const res = await api.put(`/requisition/${id}/reject`, { reason });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to reject requisition");
    }
  }

  // ───────────────────────────────────
  // DELETE
  // ───────────────────────────────────
  async deleteRequisition(id: string): Promise<void> {
    try {
      await api.delete(`/requisition/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete requisition"
      );
    }
  }
}

// Export instance + methods for easy import
const requisitionService = new RequisitionService();
export default requisitionService;

// Named exports like your riskReportService
export const {
  createRequisition,
  getRequisitions,
  getRequisitionById,
  updateRequisition,
  approveRequisition,
  rejectRequisition,
  deleteRequisition,
} = requisitionService;
