"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { authService, UserMe } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ModeToggle } from "@/components/mode-toggle"

export default function ProfilePage() {
  const { role, user } = useAuth()
  const [profile, setProfile] = useState<UserMe | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe()
        setProfile(data)
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      }
    }

    fetchProfile()
  }, [])

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
                  <AvatarImage src="/avatars/shadcn.jpg" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">Alterar Foto</Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Nome Completo</Label>
                <Input value={displayName} disabled className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Email</Label>
                <Input value={displayEmail} disabled className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500" />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Função (Role)</Label>
                <Input value={String(displayRole)} disabled className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-500 font-mono uppercase" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Segurança</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Atualize sua senha de acesso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Senha Atual</Label>
                <Input type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Nova Senha</Label>
                <Input type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Confirmar Nova Senha</Label>
                <Input type="password" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="pt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}