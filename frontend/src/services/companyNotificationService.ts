import api from '../api/api'; // Axios instance

export interface Recipient {
  id: string;
  type: 'COMPANY' | 'EMPLOYEE';
  read: boolean;
}

export interface Notification {
  id: string;
  senderId?: string;
  senderType?: 'COMPANY' | 'EMPLOYEE';
  title: string;
  message: string;
  link?: string;
  recipients: Recipient[];
  createdAt: string;
  updatedAt: string;
}

class CompanyNotificationService {
  // ───────────────────────────────
  // CREATE NOTIFICATION
  // ───────────────────────────────
  async createNotification(data: {
    recipients: Recipient[];
    title: string;
    message: string;
    link?: string;
  }): Promise<Notification> {
    try {
      const response = await api.post('/notifications', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create notification');
    }
  }

  // ───────────────────────────────
  // GET ALL NOTIFICATIONS
  // ───────────────────────────────
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }

  // ───────────────────────────────
  // MARK AS READ
  // ───────────────────────────────
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
}

// Singleton export
const companyNotificationService = new CompanyNotificationService();
export default companyNotificationService;
export const { createNotification, getNotifications, markAsRead } = companyNotificationService;
