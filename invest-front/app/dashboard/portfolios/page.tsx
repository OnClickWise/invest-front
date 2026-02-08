"use client"

import { useAuth } from "@/contexts/auth-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Wallet, TrendingUp, DollarSign } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

const assets = [
  { id: 1, ticker: "PETR4", type: "Ação BR", quantity: 100, avgPrice: 32.50, currentPrice: 35.80, total: "R$ 3.580,00", client: "Ana Silva" },
  { id: 2, ticker: "HGLG11", type: "FII", quantity: 50, avgPrice: 160.00, currentPrice: 162.50, total: "R$ 8.125,00", client: "Ana Silva" },
  { id: 3, ticker: "CDB 110% CDI", type: "Renda Fixa", quantity: 1, avgPrice: 10000, currentPrice: 10450, total: "R$ 10.450,00", client: "Carlos Mendes" },
]

export default function PortfoliosPage() {
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
                <BreadcrumbPage className="text-slate-900 dark:text-white">Carteiras & Ativos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

      {role === 'INVESTOR' ? (
         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Wallet className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Área do Gestor</h2>
            <p className="text-slate-500 max-w-md">Esta tela é para gestão de ativos. Para ver seus investimentos, acesse a página "Meu Patrimônio".</p>
         </div>
      ) : (
        <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Gestão de Ativos</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Controle os ativos nas carteiras dos seus clientes.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">Nova Carteira</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Novo Ativo
                    </Button>
                </div>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Wallet size={20}/></div>
                    <div><p className="text-xs text-slate-500">Total Custódia</p><p className="font-bold text-lg text-slate-900 dark:text-white">R$ 14.500,00</p></div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"><TrendingUp size={20}/></div>
                    <div><p className="text-xs text-slate-500">Rentabilidade</p><p className="font-bold text-lg text-slate-900 dark:text-white">+1.2%</p></div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><DollarSign size={20}/></div>
                    <div><p className="text-xs text-slate-500">Dividendos (Mês)</p><p className="font-bold text-lg text-slate-900 dark:text-white">R$ 145,20</p></div>
                </div>
            </div>

            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex-1 overflow-auto shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                            <TableHead className="text-slate-500 dark:text-slate-400">Ativo</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Tipo</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Cliente</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Qtd.</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Preço Médio</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Preço Atual</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Total</TableHead>
                            <TableHead className="text-right text-slate-500 dark:text-slate-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets.map((asset) => (
                            <TableRow key={asset.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <TableCell className="font-bold text-slate-900 dark:text-white">{asset.ticker}</TableCell>
                                <TableCell className="text-xs text-slate-500 uppercase">{asset.type}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">{asset.client}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">{asset.quantity}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-300">R$ {asset.avgPrice.toFixed(2)}</TableCell>
                                <TableCell className={asset.currentPrice > asset.avgPrice ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-rose-600 dark:text-rose-400 font-medium"}>
                                    R$ {asset.currentPrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="font-bold text-slate-900 dark:text-white">{asset.total}</TableCell>
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