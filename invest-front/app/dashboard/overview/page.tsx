"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wallet, TrendingUp, AlertCircle } from "lucide-react"
import { RecentTransactions } from "@/components/invest/recent-transactions"

export default function OverviewPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-500 dark:text-slate-400" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-300 dark:bg-slate-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Visão Geral</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto"><ModeToggle /></div>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Visão Geral da Gestora</h1>
        
        {/* KPIs do Admin */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total sob Gestão (AUM)</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">R$ 14.5M</div></CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Investidores Ativos</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">84</div></CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Rentabilidade Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">1.45% <span className="text-xs font-normal text-slate-400">/mês</span></div></CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Alertas</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">3</div></CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Últimas Atividades</h2>
              <RecentTransactions />
           </div>
           {/* Placeholder para gráfico de performance da gestora */}
           <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Performance Consolidada</h2>
              <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
                 Gráfico de AUM (Em breve)
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}