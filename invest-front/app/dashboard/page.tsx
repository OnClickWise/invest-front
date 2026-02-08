"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProjectionTool } from "@/components/invest/projection-tool"
import { AllocationChart } from "@/components/invest/allocation-chart"
import { RecentTransactions } from "@/components/invest/recent-transactions"
import { ModeToggle } from "@/components/mode-toggle"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Wallet, Users, TrendingUp, ShieldCheck, Target } from "lucide-react"

// Card adaptativo
function MetricCard({ title, value, icon: Icon, change }: any) {
  return (
    <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center mt-1">
          {change} <span className="text-slate-500 ml-1">vs. mês anterior</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { role } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-300 dark:bg-slate-800" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">OnClickInvest</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-slate-300 dark:text-slate-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-900 dark:text-white">Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
             <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden md:inline-block mr-2">
                  {role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'ADMIN' ? 'Gestor' : 'Investidor'}
                </span>
                <ModeToggle />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
             {role === 'SUPER_ADMIN' && (
                <>
                  <MetricCard title="Tenants Ativos" value="124" change="+12%" icon={Building2} />
                  <MetricCard title="AUM Global" value="R$ 4.2B" change="+8.4%" icon={Wallet} />
                  <MetricCard title="Receita SaaS (MRR)" value="R$ 840k" change="+15%" icon={TrendingUp} />
                </>
             )}
             {role === 'ADMIN' && (
                <>
                  <MetricCard title="Carteiras" value="84" change="+4" icon={Users} />
                  <MetricCard title="Patrimônio" value="R$ 145M" change="+1.2%" icon={Wallet} />
                  <MetricCard title="Rentabilidade" value="1.45%" change="+0.2%" icon={TrendingUp} />
                </>
             )}
             {role === 'INVESTOR' && (
                <>
                  <MetricCard title="Meu Saldo" value="R$ 152.400" change="+2.5%" icon={Wallet} />
                  <MetricCard title="Rentabilidade" value="18.4%" change="+1.2%" icon={TrendingUp} />
                  <MetricCard title="Projeção 2028" value="R$ 480k" change="No prazo" icon={Target} />
                </>
             )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
               Simulação Financeira
            </h2>
            <ProjectionTool />
          </div>

          <div className="grid auto-rows-min gap-6 md:grid-cols-2">
             <AllocationChart />
             <RecentTransactions />
          </div>
        </div>
    </div>
  )
}