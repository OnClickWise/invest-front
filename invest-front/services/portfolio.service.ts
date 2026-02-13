import { api } from "@/lib/api";

export interface Portfolio {
  id: string;
  name: string;
  investorId?: string;
  investorName?: string;
  totalValue?: number;
  assets?: any[]; // Detalhes dos ativos se a API retornar
}

export const portfolioService = {
  // Lista carteiras
  getAll: async () => {
    const response = await api.get<Portfolio[]>('/portfolios');
    return response.data;
  },

  // Cria nova carteira
  create: async (data: { name: string; investorId: string }) => {
    const response = await api.post('/portfolios', data);
    return response.data;
  }
};