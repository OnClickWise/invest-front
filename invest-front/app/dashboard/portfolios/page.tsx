"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { portfolioService } from "@/services/portfolio.service"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Wallet, TrendingUp, DollarSign, Loader2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function PortfoliosPage() {
  const { role } = useAuth()
  // Estado para armazenar as carteiras vindas da API
  const [portfolios, setPortfolios] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)

  // Busca os dados assim que a página carrega (se for Admin)
  useEffect(() => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        fetchPortfolios()
    } else {
        setLoading(false)
    }
  }, [role])

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      // Chama o serviço que bate no .NET
      const data = await portfolioService.getAll().catch(() => []) 
      setPortfolios(data)
    } catch (error) {
      console.error("Erro ao buscar carteiras", error)
    } finally {
      setLoading(false)
    }
  }

  // Formatador de Moeda (USD)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-300 dark:bg-slate-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Portfolios & Assets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>

      {/* Visão de Investidor: Bloqueada/Redirecionada */}
      {role === 'INVESTOR' ? (
         <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Wallet className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Manager Area</h2>
            <p className="text-slate-500 max-w-md">To see your investments, go to "My Wealth".</p>
         </div>
      ) : (
        /* Visão de Admin: Gestão Completa */
        <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Asset Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Control assets in your clients' portfolios.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">New Portfolio</Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> New Asset
                    </Button>
                </div>
            </div>

            {/* Cards de Resumo (Estáticos por enquanto, placeholders para API futura) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Wallet size={20}/></div>
                    <div>
                        <p className="text-xs text-slate-500">Total Custody</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-white">$3.5M</p>
                    </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"><TrendingUp size={20}/></div>
                    <div>
                        <p className="text-xs text-slate-500">Avg Return</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-white">+8.2%</p>
                    </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 shadow-sm">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"><DollarSign size={20}/></div>
                    <div>
                        <p className="text-xs text-slate-500">Dividends (Mo)</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-white">$12,450</p>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex-1 overflow-auto shadow-sm">
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-500" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                                <TableHead className="text-slate-500 dark:text-slate-400">Portfolio / Asset</TableHead>
                                <TableHead className="text-slate-500 dark:text-slate-400">Investor</TableHead>
                                <TableHead className="text-slate-500 dark:text-slate-400">Total Value</TableHead>
                                <TableHead className="text-right text-slate-500 dark:text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Verifica se a lista está vazia */}
                            {portfolios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                        No portfolios found. Create one to start managing assets.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                portfolios.map((item: any) => (
                                    <TableRow key={item.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <TableCell className="font-bold text-slate-900 dark:text-white">
                                            {item.name || 'Unnamed Portfolio'}
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">
                                            {item.investorName || item.investorId || '-'}
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(item.totalValue || 0)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
      )}
    </div>
  )
}