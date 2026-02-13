import { api } from "@/lib/api";

export interface Investor {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  // Campos adicionais para exibição na tabela
  status?: string; 
  patrimony?: number;
}

export const investorService = {
  // Chama o GET /api/investors do seu Backend .NET
  getAll: async () => {
    const response = await api.get<Investor[]>('/investors');
    return response.data;
  },

  // Chama o POST /api/investors do seu Backend .NET
  create: async (data: { name: string; email: string }) => {
    const response = await api.post('/investors', data);
    return response.data;
  }
};