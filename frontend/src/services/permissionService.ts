import api from "../api/api"; // Axios instance with JWT
import { Employee } from "../context/EmployeeAuthContext";

export interface Permission {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePermission {
  id: string;
  employeeId: string;
  permissionId: string;
  createdAt: string;
  employee?: Employee;
  permission?: Permission;
}

class PermissionService {
  // ───────────────────────────────────────────────
  // CREATE PERMISSION
  // ───────────────────────────────────────────────
  async createPermission(data: { name: string; description?: string }) {
    try {
      const res = await api.post("/permissions", data);
      return res.data as Permission;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create permission";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // GET ALL PERMISSIONS
  // ───────────────────────────────────────────────
  async getAll() {
    try {
      const res = await api.get("/permissions");
      return res.data as Permission[];
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch permissions";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // UPDATE PERMISSION
  // ───────────────────────────────────────────────
  async updatePermission(id: string, data: { name?: string; description?: string }) {
    try {
      const res = await api.put(`/permissions/${id}`, data);
      return res.data as Permission;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update permission";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // DELETE PERMISSION
  // ───────────────────────────────────────────────
  async deletePermission(id: string) {
    try {
      const res = await api.delete(`/permissions/${id}`);
      return res.data as Permission;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete permission";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // ASSIGN PERMISSION TO EMPLOYEE
  // ───────────────────────────────────────────────
  async assignPermission(employeeId: string, permissionId: string) {
    try {
      const res = await api.post("/permissions/assign", { employeeId, permissionId });
      return res.data as EmployeePermission;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to assign permission";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // REMOVE PERMISSION FROM EMPLOYEE
  // ───────────────────────────────────────────────
  async removePermission(employeeId: string, permissionId: string) {
    try {
      const res = await api.delete("/permissions/remove", { data: { employeeId, permissionId } });
      return res.data as EmployeePermission;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to remove permission";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // GET PERMISSIONS OF AN EMPLOYEE
  // ───────────────────────────────────────────────
  async getEmployeePermissions(employeeId: string) {
    try {
      const res = await api.get(`/permissions/employee/${employeeId}`);
      return res.data as EmployeePermission[];
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch employee permissions";
      throw new Error(msg);
    }
  }

  // ───────────────────────────────────────────────
  // GET EMPLOYEES WHO HAVE A PERMISSION
  // ───────────────────────────────────────────────
  async getEmployeesWithPermission(permissionId: string) {
    try {
      const res = await api.get(`/permissions/${permissionId}/employees`);
      return res.data as EmployeePermission[];
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch employees for permission";
      throw new Error(msg);
    }
  }
}

// Singleton export
const permissionService = new PermissionService();
export default permissionService;

// Optional named exports
export const {
  createPermission,
  getAll,
  updatePermission,
  deletePermission,
  assignPermission,
  removePermission,
  getEmployeePermissions,
  getEmployeesWithPermission,
} = permissionService;
