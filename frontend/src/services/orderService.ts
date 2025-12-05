import api from '../api/api'; // Axios instance

class OrderService {
  // ✅ Create a new order
  async createOrder(orderData: {
    clientId?: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    items: { menuItemId: string; unitPrice: number; quantity: number }[];
  }) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to create order';
      throw new Error(msg);
    }
  }

  // ✅ Update order status
  async updateStatus(orderId: string, status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED') {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      console.warn(response.data);
      
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update order status';
      throw new Error(msg);
    }
  }

  async updatePaymentStatus(
  orderId: string,
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING' | 'DEBTED'
) {
  try {
    const response = await api.patch(`/orders/${orderId}/payment-status`, { status });
    console.log('Payment status updated:', response.data);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Failed to update payment status';
    throw new Error(msg);
  }
}

  // ✅ Get order by ID
  async getOrderById(orderId: string) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch order';
      throw new Error(msg);
    }
  }

  // ✅ Get all orders with optional filters
  async getAllOrders(filters?: { clientName?: string; clientEmail?: string; clientPhone?: string }) {
    try {
      const params = filters || {};
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch orders';
      throw new Error(msg);
    }
  }

  // ✅ Get all orders for a specific client
  async getOrdersByOrderNumber(orderNumber: string) {
    try {
      const response = await api.get(`/orders/order-number/${orderNumber}`);
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch client orders';
      throw new Error(msg);
    }
  }
  async getOrdersByClient(clientId: string) {
    try {
      const response = await api.get(`/orders/client/${clientId}`);
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch client orders';
      throw new Error(msg);
    }
  }
  async getOrdersByCompany(companyId: string) {
    try {
      const response = await api.get(`/orders/company/${companyId}`);
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch client orders';
      throw new Error(msg);
    }
  }
  async getOrdersByEmployee(employeeId: string) {
    try {
      const response = await api.get(`/orders/employee/${employeeId}`);
      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to fetch client orders';
      throw new Error(msg);
    }
  }
}

const orderService = new OrderService();
export default orderService;

// Optional named exports for convenience
export const {
  createOrder,
  updateStatus,
  getOrderById,
  getAllOrders,
  getOrdersByClient,
} = orderService;
