"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { inviteService } from "@/services/invite.service";

export function InviteInvestor() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await inviteService.inviteInvestor({
        email,
        fullName,
        message,
      });

      setSuccess(true);
      setEmail("");
      setFullName("");
      setMessage("");

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao enviar convite"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <h2 className="text-xl font-bold mb-4">Convidar Investidor</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          ✓ Convite enviado com sucesso!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          ✕ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Nome Completo
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="João Silva"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="joao@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Mensagem Personalizada (opcional)
          </label>
          <textarea
            id="message"
            placeholder="Escreva uma mensagem pessoal..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Enviando..." : "Enviar Convite"}
        </Button>
      </form>
    </Card>
  );
}
