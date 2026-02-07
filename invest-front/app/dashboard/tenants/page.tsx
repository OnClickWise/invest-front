"use client"

import { useAuth } from "@/contexts/auth-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Building2, Search, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"

// Dados de Exemplo
const tenants = [
  { id: "TNT001", name: "Alpha Capital", domain: "alpha.invest.com", plan: "Enterprise", status: "Ativo", users: 45, mrr: "R$ 12.500,00", logo: "AC" },
  { id: "TNT002", name: "BlueStone Invest", domain: "bluestone.com.br", plan: "Pro", status: "Ativo", users: 12, mrr: "R$ 4.800,00", logo: "BS" },
]

export default function TenantsPage() {
  const { role } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-400 hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-slate-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Tenants & Gestoras</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Lógica de Proteção */}
      {role !== 'SUPER_ADMIN' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="h-24 w-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20">
                <Lock className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
            <p className="text-slate-400">Página exclusiva para Super Admin.</p>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>Voltar</Button>
        </div>
      ) : (
        <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Gestoras (Tenants)</h1>
                    <p className="text-slate-400 text-sm">Administre as empresas que utilizam sua plataforma.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="mr-2 h-4 w-4" /> Nova Gestora</Button>
            </div>
            
            <div className="rounded-md border border-slate-800 bg-slate-900/50 flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800"><TableHead className="text-slate-400">Empresa</TableHead><TableHead className="text-slate-400">Status</TableHead><TableHead className="text-right text-slate-400">Ações</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        {tenants.map((t) => (
                            <TableRow key={t.id} className="border-slate-800">
                                <TableCell className="text-white font-medium">{t.name}</TableCell>
                                <TableCell><Badge variant="outline" className="text-blue-400 border-blue-500/30">{t.status}</Badge></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4 text-slate-400" /></Button></TableCell>
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