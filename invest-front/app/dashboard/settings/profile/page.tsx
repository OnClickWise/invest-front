"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { authService, UserMe } from "@/services/auth.service"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ModeToggle } from "@/components/mode-toggle"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function ProfilePage() {
  const { role, user } = useAuth()
  const [profile, setProfile] = useState<UserMe | null>(null)

  // Estados para perfil
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Estados para senha
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe()
        setProfile(data)
        setProfileEmail(data.email)
        setProfileName(data.email.split('@')[0])
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      }
    }

    fetchProfile()
  }, [])

  const handleChangePassword = async () => {
    setPasswordMessage(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Preencha todos os campos' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'As senhas não coincidem' })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' })
      return
    }

    try {
      setSavingPassword(true)
      await api.post('/admin/users/change-password', {
        currentPassword,
        newPassword
      })
      setPasswordMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      setPasswordMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao alterar senha' 
      })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleUpdateProfile = async () => {
    setProfileMessage(null)

    if (!profileEmail) {
      setProfileMessage({ type: 'error', text: 'Email é obrigatório' })
      return
    }

    try {
      setSavingProfile(true)
      await api.put('/admin/users/profile', {
        email: profileEmail,
        name: profileName
      })
      setProfileMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      setEditingProfile(false)
      // Recarrega o perfil
      const data = await authService.getMe()
      setProfile(data)
    } catch (error: any) {
      setProfileMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao atualizar perfil' 
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const displayEmail = profile?.email || user?.email || ""
  const displayRole = profile?.role ?? user?.role ?? role
  const displayName = useMemo(() => {
    if (!displayEmail) return ""
    const base = displayEmail.split("@")[0]
    return base.charAt(0).toUpperCase() + base.slice(1)
  }, [displayEmail])

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-300 dark:bg-slate-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-slate-300 dark:text-slate-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 dark:text-white">Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações de Perfil</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie suas informações pessoais e de acesso.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Dados Pessoais</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Informações visíveis no sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-slate-200 dark:border-slate-700">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} />
                  <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  disabled
                  title="Upload de foto em desenvolvimento"
                >
                  Alterar Foto
                </Button>
              </div>
              
              {profileMessage && (
                <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                  profileMessage.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                }`}>
                  {profileMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span className="text-sm">{profileMessage.text}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Nome Completo</Label>
                <Input 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)}
                  disabled={!editingProfile}
                  className={editingProfile ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500"}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Email</Label>
                <Input 
                  value={profileEmail} 
                  onChange={(e) => setProfileEmail(e.target.value)}
                  disabled={!editingProfile}
                  type="email"
                  className={editingProfile ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500"}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Função (Role)</Label>
                <Input value={String(displayRole)} disabled className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 font-mono uppercase" />
              </div>

              <div className="flex gap-2">
                {!editingProfile ? (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setEditingProfile(true)}
                  >
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleUpdateProfile}
                      disabled={savingProfile}
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar'
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditingProfile(false)
                        setProfileEmail(profile?.email || "")
                        setProfileName(profile?.email.split('@')[0] || "")
                        setProfileMessage(null)
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Segurança</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Atualize sua senha de acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordMessage && (
                <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                  passwordMessage.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                }`}>
                  {passwordMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span className="text-sm">{passwordMessage.text}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Senha Atual</Label>
                <Input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Nova Senha</Label>
                <Input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Confirmar Nova Senha</Label>
                <Input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                />
              </div>
              <div className="pt-4">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleChangePassword}
                  disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}