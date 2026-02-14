import { api } from "@/lib/api";

export interface ProjectionScenario {
  name: string;
  annualRate: number;
}

export interface ProjectionRequest {
  investorId: string;
  initialCapital: number;
  monthlyContribution: number;
  years: number;
  scenarios: ProjectionScenario[];
}

export interface ProjectionKpi {
  totalInvested: number;
  finalAmount: number;
  totalProfit: number;
  profitabilityPercent: number;
}

export interface ProjectionScenarioResult {
  name: string;
  data: number[];
  kpis: ProjectionKpi;
}

export interface ProjectionResponse {
  labels: string[];
  scenarios: ProjectionScenarioResult[];
}

export const reportService = {
  generateProjection: async (data: ProjectionRequest) => {
    const response = await api.post<ProjectionResponse>("/api/reports/projection", data);
    return response.data;
  },
};
