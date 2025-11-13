import api from '../api/api'; // Your configured Axios instance

class EmployeeService {
  // ✅ Create a new employee (with file uploads)
  async createEmployee(formData: FormData) {
    try {
      const response = await api.post('/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to create employee';
      throw new Error(msg);
    }
  }

  // ✅ Get all employees for the logged-in company
  async getAllEmployees() {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to fetch employees';
      throw new Error(msg);
    }
  }

  // ✅ Get single employee by ID
  async getEmployeeById(employeeId: string) {
    try {
      const response = await api.get(`/employees/${employeeId}`);
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to fetch employee details';
      throw new Error(msg);
    }
  }

  // ✅ Update employee (with optional file uploads)
  async updateEmployee(employeeId: string, formData: FormData) {
    try {
      const response = await api.put(`/employees/${employeeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to update employee';
      throw new Error(msg);
    }
  }

  // ✅ Delete employee
  async deleteEmployee(employeeId: string) {
    try {
      const response = await api.delete(`/employees/${employeeId}`);
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to delete employee';
      throw new Error(msg);
    }
  }
}

// ✅ Singleton export
const employeeService = new EmployeeService();
export default employeeService;

// ✅ Optional named exports for convenience
export const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = employeeService;
