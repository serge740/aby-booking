import api from "../api/api";

export interface Stock {
  id: string;
  companyId: string;
  employeeId?: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}


class StockService {
  // CREATE STOCK
  async createStock(data: {
    name: string;
    sku: string;
    quantity: number;
    unit: string;
    price: number;
    description?: string;
    companyId?: string;
    employeeId?: string;
  }): Promise<Stock> {
    try {
      const response = await api.post("/stock", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create stock");
    }
  }

  // GET ALL
  async getAllStock(): Promise<Stock[]> {
    try {
      const response = await api.get("/stock");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch stocks");
    }
  }

  // GET ONE
  async getStockById(id: string): Promise<Stock> {
    try {
      const response = await api.get(`/stock/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch stock item");
    }
  }

  // UPDATE STOCK
  async updateStock(
    id: string,
    data: {
      name?: string;
      sku?: string;
      quantity?: number;
      unit?: string;
      price?: number;
      description?: string;
    }
  ): Promise<Stock> {
    try {
      const response = await api.put(`/stock/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update stock");
    }
  }

  // DELETE STOCK
  async deleteStock(id: string): Promise<void> {
    try {
      await api.delete(`/stock/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete stock");
    }
  }
}

// Singleton instance
const stockService = new StockService();
export default stockService;

// Named exports
export const {
  createStock,
  getAllStock,
  getStockById,
  updateStock,
  deleteStock,
} = stockService;
