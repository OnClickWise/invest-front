import { api } from "@/lib/api";

export interface Tenant {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export const tenantService = {
  getAll: async () => {
    const response = await api.get<Tenant[]>("/tenants");
    return response.data;
  },

  create: async (data: { name: string }) => {
    const response = await api.post<Tenant>("/tenants", data);
    return response.data;
  },

  update: async (id: string, data: { name: string; isActive: boolean }) => {
    const response = await api.put<Tenant>(`/tenants/${id}`, data);
    return response.data;
  },

  activate: async (id: string) => {
    await api.patch(`/tenants/${id}/activate`);
  },

  deactivate: async (id: string) => {
    await api.patch(`/tenants/${id}/deactivate`);
  },
};
