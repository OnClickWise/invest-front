import { api } from "@/lib/api";

export interface UserMe {
  id: string;
  email: string;
  role: string | number;
  tenantId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserMe;
}

export const authService = {
  registerTenant: async (data: { organizationName: string; adminEmail: string; password: string }) => {
    const response = await api.post<LoginResponse>("/auth/register-tenant", data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<UserMe>("/auth/me");
    return response.data;
  },
};
