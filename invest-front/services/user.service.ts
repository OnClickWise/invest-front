import { api } from "@/lib/api";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  tenantId?: string;
  createdAt: string;
  isActive: boolean;
}

export const userService = {
  getAdmins: async () => {
    const response = await api.get<AdminUser[]>("/admin/users/admins");
    return response.data;
  },

  createAdmin: async (data: { tenantId: string; email: string; password: string }) => {
    const response = await api.post<AdminUser>("/admin/users/admins", data);
    return response.data;
  },
};
