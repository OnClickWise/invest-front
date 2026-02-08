"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">Nova Senha</CardTitle>
        <CardDescription className="text-center text-slate-500 dark:text-slate-400">
          Crie uma nova senha segura para sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Nova Senha</Label>
          <Input id="password" type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Senha</Label>
          <Input id="confirm-password" type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Alterar Senha
        </Button>
      </CardContent>
    </Card>
  )
}