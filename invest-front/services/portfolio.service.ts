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
    const response = await api.get<Portfolio[]>('/api/portfolios');
    return response.data;
  },

  getByInvestor: async (investorId: string) => {
    const response = await api.get<Portfolio[]>(`/api/portfolios/investor/${investorId}`);
    return response.data;
  },

  // Cria nova carteira
  create: async (data: { name: string; investorId: string; initialAmount: number; description?: string }) => {
    const response = await api.post('/api/portfolios', data);
    return response.data;
  }
};