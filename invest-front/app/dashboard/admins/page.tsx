"use client"

import { useAuth } from "@/contexts/auth-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Search, Shield, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
// Novos imports para o Modal (Dialog)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const admins = [
  { id: 1, name: "Leovigildo Miguel", email: "leovigildo@alpha.com", tenant: "Alpha Capital", status: "Ativo" },
  { id: 2, name: "Vinicius Oliveira", email: "vinicius@bluestone.com", tenant: "BlueStone Invest", status: "Ativo" },
  { id: 3, name: "Arthur Torres", email: "arthur@nexus.app", tenant: "Nexus Wealth", status: "Pendente" },
]

export default function AdminsPage() {
  const { role } = useAuth()

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
                <BreadcrumbPage className="text-slate-900 dark:text-white">Gestão de Admins</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

      {role !== 'SUPER_ADMIN' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="h-24 w-24 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-500/20">
                <Lock className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acesso Restrito</h2>
            <p className="text-slate-500 dark:text-slate-400">Apenas Super Admins podem gerenciar outros administradores.</p>
            <Button variant="outline" className="border-slate-300 dark:border-slate-700" onClick={() => window.location.href = '/dashboard'}>Voltar</Button>
        </div>
      ) : (
        <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admins do Sistema</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie os usuários que têm acesso administrativo aos Tenants.</p>
                </div>
                
                {/* MODAL DE NOVO ADMIN */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Novo Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                      <DialogTitle className="text-slate-900 dark:text-white">Criar Novo Admin</DialogTitle>
                      <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Preencha os dados abaixo para convidar um novo administrador de Tenant.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Nome Completo</Label>
                        <Input id="name" placeholder="Ex: João Silva" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Corporativo</Label>
                        <Input id="email" type="email" placeholder="joao@empresa.com" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tenant" className="text-slate-700 dark:text-slate-300">Vincular ao Tenant</Label>
                        <Input id="tenant" placeholder="Ex: Alpha Capital" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">Enviar Convite</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* FIM DO MODAL */}

            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input type="search" placeholder="Buscar admin..." className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white" />
                </div>
            </div>

            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex-1 overflow-auto shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                            <TableHead className="text-slate-500 dark:text-slate-400">Nome</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Email</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Tenant Vinculado</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Status</TableHead>
                            <TableHead className="text-right text-slate-500 dark:text-slate-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <TableCell className="font-medium flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Shield className="h-4 w-4 text-blue-500" />
                                    {admin.name}
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">{admin.email}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">{admin.tenant}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={admin.status === 'Ativo' ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/20 dark:bg-emerald-500/10' : 'text-amber-600 bg-amber-50'}>
                                        {admin.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><MoreHorizontal className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
      )}
    </div>
  )
}