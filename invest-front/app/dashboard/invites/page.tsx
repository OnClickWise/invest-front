"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { inviteService } from "@/services/invite.service";

interface Invite {
  id: string;
  email: string;
  fullName: string;
  status: number;
  createdAt: string;
  acceptedAt?: string;
  expiresAt: string;
}

export default function InvitesPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  // Carregar convites ao montar
  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    setLoadingInvites(true);
    try {
      const data = await inviteService.getInvitesPending();
      setInvites(data);
    } catch (err) {
      console.error("Erro ao carregar convites:", err);
    }
    setLoadingInvites(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await inviteService.inviteInvestor({
        email,
        fullName,
        message,
      });

      setSuccess("✅ Convite enviado com sucesso!");
      setEmail("");
      setFullName("");
      setMessage("");

      // Recarregar lista
      loadInvites();

      // Limpar mensagem após 3s
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao enviar convite"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (inviteId: string) => {
    try {
      await inviteService.resendInvite(inviteId);
      setSuccess("✅ Convite reenviado!");
      loadInvites();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erro ao reenviar convite");
    }
  };

  const handleCancel = async (inviteId: string) => {
    try {
      await inviteService.cancelInvite(inviteId);
      setSuccess("✅ Convite cancelado!");
      loadInvites();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erro ao cancelar convite");
    }
  };

  const getStatusBadge = (status: number) => {
    const statuses: Record<number, { label: string; color: string }> = {
      0: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
      1: { label: "Aceito", color: "bg-green-100 text-green-800" },
      2: { label: "Expirado", color: "bg-red-100 text-red-800" },
      3: { label: "Cancelado", color: "bg-gray-100 text-gray-800" },
    };

    const s = statuses[status] || statuses[0];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${s.color}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Convidar Investidores</h1>
      </div>

      {/* Formulário */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Novo Convite</h2>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome Completo *
              </label>
              <Input
                type="text"
                placeholder="João Silva"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                E-mail *
              </label>
              <Input
                type="email"
                placeholder="joao@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mensagem Personalizada (opcional)
            </label>
            <textarea
              placeholder="Digite uma mensagem pessoal..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded text-sm"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Enviando..." : "Enviar Convite"}
          </Button>
        </form>
      </Card>

      {/* Lista de Convites */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Convites Pendentes ({invites.length})
        </h2>

        {loadingInvites ? (
          <div className="text-center py-8">Carregando...</div>
        ) : invites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum convite pendente
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Criado em</th>
                  <th className="px-4 py-2 text-left">Expira em</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{invite.fullName}</td>
                    <td className="px-4 py-2">{invite.email}</td>
                    <td className="px-4 py-2">{getStatusBadge(invite.status)}</td>
                    <td className="px-4 py-2 text-xs">
                      {new Date(invite.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        {invite.status === 0 && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResend(invite.id)}
                            >
                              Reenviar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancel(invite.id)}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                        {invite.status !== 0 && (
                          <span className="text-xs text-gray-500">
                            {invite.status === 1 && "Aceito"}
                            {invite.status === 2 && "Expirado"}
                            {invite.status === 3 && "Cancelado"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
