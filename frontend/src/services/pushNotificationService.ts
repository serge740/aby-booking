import api from '../api/api'; // Axios instance


export type UserType = 'EMPLOYEE' | 'COMPANY' | 'ADMIN';
export enum UserTypeEnum {
  EMPLOYEE = 'EMPLOYEE',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
 
}

export interface PushSubscription {
  id: string;             // unique record ID
  userId: string;         // employee or company ID
  type: UserType;         // user type: EMPLOYEE, COMPANY, ADMIN
  endpoint: string;       // unique per device/browser
  p256dh: string;         // encryption key
  auth: string;           // encryption key
  label?: string;         // optional label to describe device/browser
  createdAt: string;      // ISO string representation of record creation
}

export interface PushNotificationResponse {
  success: boolean;
  sent?: number;
  message?: string;
}

// ───────────────────────────────
// PUSH NOTIFICATION SERVICE
// ───────────────────────────────
class PushNotificationService {
  // ───────────────────────────────
  // SUBSCRIBE DEVICE
  // ───────────────────────────────
  async subscribe(
    userId: string,
    type: UserType,
    subscription: PushSubscription,
    label?: string
  ): Promise<PushNotificationResponse> {
    try {
      const response = await api.post('/push-notification/subscribe', {
        userId,
        type,
        subscription,
        label,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to subscribe device');
    }
  }

  // ───────────────────────────────
  // UNSUBSCRIBE SINGLE DEVICE
  // ───────────────────────────────
  async unsubscribeDevice(
    userId: string,
    type: UserType,
    endpoint: string
  ): Promise<PushNotificationResponse> {
    try {
      const response = await api.delete('/push-notification/unsubscribe/device', {
        data: { userId, type, endpoint },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unsubscribe device');
    }
  }

  // ───────────────────────────────
  // UNSUBSCRIBE ALL DEVICES
  // ───────────────────────────────
  async unsubscribeAllDevices(
    userId: string,
    type: UserType
  ): Promise<PushNotificationResponse> {
    try {
      const response = await api.delete('/push-notification/unsubscribe/all', {
        data: { userId, type },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unsubscribe all devices');
    }
  }

  // ───────────────────────────────
  // SEND NOTIFICATION TO SINGLE USER
  // ───────────────────────────────
  async sendToUser(
    userId: string,
    type: UserType,
    payload: any
  ): Promise<PushNotificationResponse> {
    try {
      const response = await api.post('/push-notification/send/user', {
        userId,
        type,
        payload,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send notification');
    }
  }

  // ───────────────────────────────
  // SEND NOTIFICATION TO ALL USERS OF TYPE
  // ───────────────────────────────
  async sendToAll(type: UserType, payload: any): Promise<PushNotificationResponse> {
    try {
      const response = await api.post('/push-notification/send/all', {
        type,
        payload,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send notification');
    }
  }

  // ───────────────────────────────
  // GET USER SUBSCRIPTIONS
  // ───────────────────────────────
  async getSubscriptions(userId: string, type: UserType): Promise<any[]> {
    try {
      const response = await api.get(`/push-notification/subscriptions/${userId}/${type}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }

  // ───────────────────────────────
  // GET TOTAL SUBSCRIPTIONS
  // ───────────────────────────────
  async getTotalSubscriptions(type?: UserType): Promise<number> {
    try {
      const response = await api.get(`/push-notification/count/${type || ''}`);
      return response.data.count;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription count');
    }
  }
}

// Singleton export
const pushNotificationService = new PushNotificationService();
export default pushNotificationService;
export const {
  subscribe,
  unsubscribeDevice,
  unsubscribeAllDevices,
  sendToUser,
  sendToAll,
  getSubscriptions,
  getTotalSubscriptions,
} = pushNotificationService;
