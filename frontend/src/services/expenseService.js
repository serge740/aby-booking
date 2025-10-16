import api from '../api/api'; // your configured Axios instance

class ExpenseService {
  // ✅ Create a new expense (requires admin JWT token)
  async createExpense(expenseData) {
    try {
      const response = await api.post('/expense', expenseData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create expense';
      throw new Error(msg);
    }
  }

  // ✅ Get all expenses (public endpoint)
  async getAllExpenses() {
    try {
      const response = await api.get('/expense');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch expenses';
      throw new Error(msg);
    }
  }

  // ✅ Get one expense by ID
  async getExpenseById(id) {
    try {
      const response = await api.get(`/expense/${id}`);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch expense';
      throw new Error(msg);
    }
  }

  // ✅ Update an expense
  async updateExpense(id, updatedData) {
    try {
      const response = await api.put(`/expense/${id}`, updatedData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update expense';
      throw new Error(msg);
    }
  }

  // ✅ Delete an expense
  async deleteExpense(id) {
    try {
      const response = await api.delete(`/expense/${id}`);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete expense';
      throw new Error(msg);
    }
  }
}

const expenseService = new ExpenseService();
export default expenseService;

// Optional named exports for convenience
export const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = expenseService;
