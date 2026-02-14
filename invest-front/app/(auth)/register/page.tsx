"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { authService } from "@/services/auth.service"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [organizationName, setOrganizationName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await authService.registerTenant({
        organizationName,
        adminEmail,
        password,
      })

      const token = result.accessToken || (result as any).AccessToken
      const user = result.user || (result as any).User

      if (!token || !user) {
        throw new Error("Resposta invalida do servidor")
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/dashboard")
    } catch (err) {
      console.error("Erro ao registrar tenant:", err)
      setError("Nao foi possivel criar a conta. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardContent className="space-y-4">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Nome da Organizacao</Label>
            <Input id="organization" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="Ex: Alpha Capital" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail do Admin</Label>
            <Input id="email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="nome@empresa.com" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" required />
          </div>
          {error && <p className="text-sm text-rose-500 text-center">{error}</p>}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Conta Gratis"}
          </Button>
        </form>
      </CardContent>
          <Input id="password" type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Criar Conta Grátis
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Já possui conta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-semibold">
            Fazer Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}