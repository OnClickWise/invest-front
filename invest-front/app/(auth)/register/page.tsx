"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { authService } from "@/services/auth.service"
import { Loader2, Check, X } from "lucide-react"

// Validação de força de senha
const validatePassword = (pwd: string) => {
  return {
    hasLength: pwd.length >= 8,
    hasUpperCase: /[A-Z]/.test(pwd),
    hasLowerCase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  }
}

const isPasswordValid = (pwd: string) => {
  const validation = validatePassword(pwd)
  return Object.values(validation).every(v => v)
}

export default function RegisterPage() {
  const router = useRouter()
  const [organizationName, setOrganizationName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [passwordValidation, setPasswordValidation] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordValidation(validatePassword(value))
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    // Validações
    if (!organizationName.trim()) {
      setError("Por favor, preencha o nome da organização")
      return
    }

    if (!adminEmail.trim()) {
      setError("Por favor, preencha o e-mail")
      return
    }

    if (!isPasswordValid(password)) {
      setError("A senha não atende aos requisitos de segurança")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem")
      return
    }

    setIsSubmitting(true)

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

      // NÃO salva no localStorage, vai direto para login
      router.push("/login")
    } catch (err) {
      console.error("Erro ao registrar tenant:", err)
      setError("Não foi possível criar a conta. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">On</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">OnClickInvest</CardTitle>
        <CardDescription className="text-center text-slate-500 dark:text-slate-400">
          Crie sua conta de administrador
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Nome da Organizacao</Label>
            <Input 
              id="organization" 
              value={organizationName} 
              onChange={(e) => setOrganizationName(e.target.value)} 
              placeholder="Ex: Alpha Capital" 
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail do Admin</Label>
            <Input 
              id="email" 
              type="email" 
              value={adminEmail} 
              onChange={(e) => setAdminEmail(e.target.value)} 
              placeholder="nome@empresa.com" 
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => handlePasswordChange(e.target.value)} 
              placeholder="Digite sua senha" 
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" 
              required 
            />
            
            {/* Requisitos de Senha */}
            {password && (
              <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Requisitos da senha:</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasLength ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className={passwordValidation.hasLength ? "text-green-600" : "text-slate-600 dark:text-slate-400"}>
                      Mínimo 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasUpperCase ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className={passwordValidation.hasUpperCase ? "text-green-600" : "text-slate-600 dark:text-slate-400"}>
                      Uma letra maiúscula (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasLowerCase ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className={passwordValidation.hasLowerCase ? "text-green-600" : "text-slate-600 dark:text-slate-400"}>
                      Uma letra minúscula (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasNumber ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className={passwordValidation.hasNumber ? "text-green-600" : "text-slate-600 dark:text-slate-400"}>
                      Um número (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasSpecialChar ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    <span className={passwordValidation.hasSpecialChar ? "text-green-600" : "text-slate-600 dark:text-slate-400"}>
                      Um caractere especial (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirme sua senha" 
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700" 
              required 
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500">As senhas não correspondem</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-600">Senhas correspondem</p>
            )}
          </div>

          {error && <p className="text-sm text-rose-500 text-center">{error}</p>}
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" 
            type="submit" 
            disabled={isSubmitting || !isPasswordValid(password) || password !== confirmPassword}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Conta Gratis"}
          </Button>
        </form>
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