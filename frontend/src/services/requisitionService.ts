import api from "../api/api"; // Axios instance with JWT
import { Company, Employee } from "../context/EmployeeAuthContext";
import { Stock } from "./stockService";
export enum StockPurposeStatus {
  EATING = "EATING",
  DRINKING = "DRINKING",
}

export enum RequisitionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED",
  FULLY_RECEIVED = "FULLY_RECEIVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum ReceivingStatus {
  NOT_RECEIVED = "NOT_RECEIVED",
  PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED",
  FULLY_RECEIVED = "FULLY_RECEIVED",
}

export interface ReceivingLog {
  id: string;
  requisitionItemId: string;
  receivedQty: number;
  receivedById: string;
  receivedAt: string; // ISO date string
  note?: string;

  // Relations
  receivedBy?: Employee;
}

export interface RequisitionItem {
  id: string;
  requisitionId: string;
  stockId?: string | null;

  itemName: string;
  quantity: number;
  unit: string;
  purpose: StockPurposeStatus;
  note?: string;

  // Receiving tracking
  receivedQty: number;
  receivingStatus: ReceivingStatus;

  createdAt: string;
  updatedAt: string;

  // Relations
  stock?: Stock | null;
  receivingLogs?: ReceivingLog[];
}

export interface Requisition {
  id: string;
  companyId: string;
  employeeId: string;
  status: RequisitionStatus;

  description?: string;
  rejectReason?: string;

  // Approval + Completion
  approvedAt?: string | null;
  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;

  // Relations
  company?: Company;
  employee?: Employee;
  items: RequisitionItem[];
}


class RequisitionService {
  // ───────────────────────────────────────────────
  // CREATE REQUISITION (Employee)
  // ───────────────────────────────────────────────
  async createRequisition(data: {
    description?: string;
    items: {
      itemName: string;
      quantity: number;
      unit?: string;
      purpose?: "EATING" | "DRINKING";
      note?: string;
      stockId?: string;
    }[];
    companyId?: string; // optional if token contains company
  }) {
    try {
      const res = await api.post("/requisition", data);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create requisition";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // GET ALL REQUISITIONS (Admin OR Employee)
  // ───────────────────────────────────────────────
  async getAll() {
    try {
      const res = await api.get("/requisition");
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch requisitions";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // GET SINGLE REQUISITION BY ID
  // ───────────────────────────────────────────────
  async getOne(id: string) {
    try {
      const res = await api.get(`/requisition/${id}`);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch requisition";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // GET RECEIVING SUMMARY
  // ───────────────────────────────────────────────
  async getReceivingSummary(id: string) {
    try {
      const res = await api.get(`/requisition/${id}/receiving-summary`);
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to fetch receiving summary";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // UPDATE PENDING REQUISITION (Employee)
  // ───────────────────────────────────────────────
  async update(id: string, data: any) {
    try {
      const res = await api.put(`/requisition/${id}`, data);
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to update requisition";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // APPROVE REQUISITION (Admin)
  // ───────────────────────────────────────────────
  async approve(id: string, items?: any[]) {
    try {
      const res = await api.put(`/requisition/${id}/approve`, { items });
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to approve requisition";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // RECEIVE ITEMS (Admin)
  // ───────────────────────────────────────────────
  async receiveItems(
    id: string,
    items: { itemId: string; receivedQty: number; note?: string }[]
  ) {
    try {
      const res = await api.put(`/requisition/${id}/receive`, { items });
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to receive requisition items";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // REJECT REQUISITION (Admin)
  // ───────────────────────────────────────────────
  async reject(id: string, reason: string) {
    try {
      const res = await api.put(`/requisition/${id}/reject`, { reason });
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to reject requisition";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // DELETE REQUISITION
  // ───────────────────────────────────────────────
  async delete(id: string) {
    try {
      const res = await api.delete(`/requisition/${id}`);
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Failed to delete requisition";
      throw new Error(msg);
    }
  }
}

// Singleton export
const requisitionService = new RequisitionService();
export default requisitionService;

// Optional named exports
export const {
  createRequisition,
  getAll,
  getOne,
  getReceivingSummary,
  update,
  approve,
  receiveItems,
  reject,
} = requisitionService;
