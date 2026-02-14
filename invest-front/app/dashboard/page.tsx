"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProjectionTool } from "@/components/invest/projection-tool"
import { AllocationChart } from "@/components/invest/allocation-chart"
import { RecentTransactions } from "@/components/invest/recent-transactions"
import { MarketOverview } from "@/components/invest/market-overview"
import { ModeToggle } from "@/components/mode-toggle"
import { tenantService } from "@/services/tenant.service"
import { userService } from "@/services/user.service"
import { investorService } from "@/services/investor.service"
import { portfolioService } from "@/services/portfolio.service"

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
import { Building2, Wallet, Users, TrendingUp, ShieldCheck, Target, Loader2 } from "lucide-react"

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
          {change} <span className="text-slate-500 ml-1">vs. last month</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { role, user } = useAuth();
  const [loadingMetrics, setLoadingMetrics] = useState(true)
  const [metrics, setMetrics] = useState({
    activeTenants: 0,
    totalTenants: 0,
    totalAdmins: 0,
    totalAssets: 0,
    portfolioCount: 0,
    investorCount: 0,
    investorBalance: 0,
    investorProfit: 0,
    goalProjection: 0,
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoadingMetrics(true)

        if (role === "SUPER_ADMIN") {
          const [tenants, admins] = await Promise.all([
            tenantService.getAll().catch(() => []),
            userService.getAdmins().catch(() => []),
          ])

          setMetrics((prev) => ({
            ...prev,
            activeTenants: tenants.filter((tenant) => tenant.isActive).length,
            totalTenants: tenants.length,
            totalAdmins: admins.length,
          }))
          return
        }

        if (role === "ADMIN") {
          const [portfolios, investors] = await Promise.all([
            portfolioService.getAll().catch(() => []),
            investorService.getAll().catch(() => []),
          ])

          const totalAssets = portfolios.reduce((sum, item) => sum + (item.totalValue || item.initialAmount || 0), 0)

          setMetrics((prev) => ({
            ...prev,
            totalAssets,
            portfolioCount: portfolios.length,
            investorCount: investors.length,
          }))
          return
        }

        if (role === "INVESTOR") {
          const investors = await investorService.getAll().catch(() => [])
          const investor = investors.find((item) => item.email === user?.email)
          if (!investor) return

          const portfolios = await portfolioService.getByInvestor(investor.id).catch(() => [])
          const totalAssets = portfolios.reduce((sum, item) => sum + (item.totalValue || item.initialAmount || 0), 0)

          setMetrics((prev) => ({
            ...prev,
            investorBalance: totalAssets,
            investorProfit: totalAssets * 0.124,
            goalProjection: totalAssets * 1.2,
          }))
        }
      } catch (error) {
        console.error("Erro ao carregar metricas:", error)
      } finally {
        setLoadingMetrics(false)
      }
    }

    fetchMetrics()
  }, [role, user?.email])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  }

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
             <ModeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
             {loadingMetrics ? (
               <div className="col-span-full flex items-center gap-2 text-slate-500">
                 <Loader2 className="h-4 w-4 animate-spin" /> Carregando metricas...
               </div>
             ) : (
               <>
                 {role === "SUPER_ADMIN" && (
                    <>
                      <MetricCard title="Active Tenants" value={metrics.activeTenants} change="Atualizado" icon={Building2} />
                      <MetricCard title="System Admins" value={metrics.totalAdmins} change="Atualizado" icon={ShieldCheck} />
                      <MetricCard title="Total Tenants" value={metrics.totalTenants} change="Atualizado" icon={Users} />
                    </>
                 )}
                 {role === "ADMIN" && (
                    <>
                      <MetricCard title="Portfolios" value={metrics.portfolioCount} change="Atualizado" icon={Users} />
                      <MetricCard title="Total Assets" value={formatCurrency(metrics.totalAssets)} change="Atualizado" icon={Wallet} />
                      <MetricCard title="Investors" value={metrics.investorCount} change="Atualizado" icon={TrendingUp} />
                    </>
                 )}
                 {role === "INVESTOR" && (
                    <>
                      <MetricCard title="My Balance" value={formatCurrency(metrics.investorBalance)} change="Atualizado" icon={Wallet} />
                      <MetricCard title="Total Profit" value={formatCurrency(metrics.investorProfit)} change="Atualizado" icon={TrendingUp} />
                      <MetricCard title="Goal Projection" value={formatCurrency(metrics.goalProjection)} change="On Track" icon={Target} />
                    </>
                 )}
               </>
             )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
               Financial Simulation
            </h2>
            <ProjectionTool />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
             <div className="md:col-span-1">
               <AllocationChart />
             </div>
             <div className="md:col-span-1">
               <RecentTransactions />
             </div>
             <div className="md:col-span-2 xl:col-span-1">
               <MarketOverview />
             </div>
          </div>
        </div>
    </div>
  )
}