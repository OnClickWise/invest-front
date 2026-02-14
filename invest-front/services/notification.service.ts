import { api } from "@/lib/api";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt?: string | null;
  tenantId: string;
  userId?: string | null;
  investorId?: string | null;
  createdAt: string;
}

export const notificationService = {
  getInvestorNotifications: async (tenantId: string, investorId: string) => {
    const response = await api.get<NotificationItem[]>(`/api/notifications/${tenantId}/investor/${investorId}`);
    return response.data;
  },
};
