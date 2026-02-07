"use client"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Dados Mockados de Clientes
const clients = [
  {
    id: "INV001",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    status: "Ativo",
    patrimony: "R$ 450.000,00",
    lastContribution: "R$ 5.000,00",
    date: "12 Set, 2024",
    avatar: "/avatars/01.png",
    initials: "AS"
  },
  {
    id: "INV002",
    name: "Carlos Mendes",
    email: "carlos.m@email.com",
    status: "Pendente",
    patrimony: "R$ 120.500,00",
    lastContribution: "R$ 1.200,00",
    date: "10 Set, 2024",
    avatar: "/avatars/02.png",
    initials: "CM"
  },
  {
    id: "INV003",
    name: "Mariana Costa",
    email: "mari.costa@email.com",
    status: "Ativo",
    patrimony: "R$ 1.250.000,00",
    lastContribution: "R$ 15.000,00",
    date: "08 Set, 2024",
    avatar: "/avatars/03.png",
    initials: "MC"
  },
  {
    id: "INV004",
    name: "João Pedro",
    email: "jp.invest@email.com",
    status: "Inativo",
    patrimony: "R$ 0,00",
    lastContribution: "-",
    date: "-",
    avatar: "/avatars/04.png",
    initials: "JP"
  },
]

export default function ClientsPage() {
  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header Específico desta Página */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-400 hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="text-slate-400 hover:text-white">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-slate-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">Carteira de Clientes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Conteúdo da Tabela */}
      <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Investidores</h1>
                <p className="text-slate-400 text-sm">Gerencie o acesso e patrimônio dos seus clientes.</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Buscar por nome ou email..."
                  className="pl-9 bg-slate-900 border-slate-800 text-white focus:border-emerald-500"
                />
            </div>
        </div>

        {/* Tabela */}
        <div className="rounded-md border border-slate-800 bg-slate-900/50 flex-1 overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-900">
                        <TableHead className="text-slate-400">Cliente</TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Patrimônio Total</TableHead>
                        <TableHead className="text-slate-400">Último Aporte</TableHead>
                        <TableHead className="text-right text-slate-400">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id} className="border-slate-800 hover:bg-slate-900/80 transition-colors">
                            <TableCell className="font-medium text-white">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 bg-slate-800 border border-slate-700">
                                        <AvatarImage src={client.avatar} />
                                        <AvatarFallback className="text-slate-400">{client.initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span>{client.name}</span>
                                        <span className="text-xs text-slate-500">{client.email}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`
                                    ${client.status === 'Ativo' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : ''}
                                    ${client.status === 'Pendente' ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' : ''}
                                    ${client.status === 'Inativo' ? 'text-slate-500 border-slate-500/20 bg-slate-500/10' : ''}
                                `}>
                                    {client.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-white font-mono">{client.patrimony}</TableCell>
                            <TableCell className="text-slate-300">
                                <div className="flex flex-col">
                                    <span>{client.lastContribution}</span>
                                    <span className="text-xs text-slate-500">{client.date}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </div>
    </div>
  )
}