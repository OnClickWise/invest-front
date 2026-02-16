import { api } from "@/lib/api";

export interface InviteInvestorRequest {
  email: string;
  fullName: string;
  message?: string;
  tenantId?: string;
}

export interface InviteInvestorResponse {
  success: boolean;
  message: string;
  inviteLink?: string;
}

export const inviteService = {
  // Enviar convite para investidor via SendGrid
  inviteInvestor: async (data: InviteInvestorRequest): Promise<InviteInvestorResponse> => {
    try {
      const response = await api.post<InviteInvestorResponse>("/invites/send", {
        email: data.email,
        fullName: data.fullName,
        message: data.message,
        tenantId: data.tenantId,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erro ao enviar convite para investidor");
    }
  },

  // Listar convites pendentes
  getInvitesPending: async () => {
    try {
      const response = await api.get("/invites/pending");
      return response.data;
    } catch (error) {
      throw new Error("Erro ao listar convites pendentes");
    }
  },

  // Reenviar convite
  resendInvite: async (inviteId: string): Promise<InviteInvestorResponse> => {
    try {
      const response = await api.post<InviteInvestorResponse>(
        `/invites/${inviteId}/resend`,
        {}
      );
      return response.data;
    } catch (error) {
      throw new Error("Erro ao reenviar convite");
    }
  },

  // Cancelar convite
  cancelInvite: async (inviteId: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete<{ success: boolean }>(`/invites/${inviteId}`);
      return response.data;
    } catch (error) {
      throw new Error("Erro ao cancelar convite");
    }
  },
};
