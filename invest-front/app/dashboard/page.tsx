"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProjectionTool } from "@/components/invest/projection-tool"
import { AllocationChart } from "@/components/invest/allocation-chart"
import { RecentTransactions } from "@/components/invest/recent-transactions"
import { MarketOverview } from "@/components/invest/market-overview"
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
  const { role, setRole } = useAuth();

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
             <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simular:</span>
               <select 
                 className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                 value={role}
                 onChange={(e: any) => setRole(e.target.value)}
               >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Gestor</option>
                  <option value="INVESTOR">Investidor</option>
               </select>
             </div>
             
             <ModeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
             {role === 'SUPER_ADMIN' && (
                <>
                  <MetricCard title="Active Tenants" value="124" change="+12%" icon={Building2} />
                  <MetricCard title="Global AUM" value="$840M" change="+8.4%" icon={Wallet} />
                  <MetricCard title="SaaS MRR" value="$150k" change="+15%" icon={TrendingUp} />
                </>
             )}
             {role === 'ADMIN' && (
                <>
                  <MetricCard title="Portfolios" value="84" change="+4" icon={Users} />
                  <MetricCard title="Total Assets" value="$2.4M" change="+1.2%" icon={Wallet} />
                  <MetricCard title="Avg. Return" value="8.4%" change="+0.2%" icon={TrendingUp} />
                </>
             )}
             {role === 'INVESTOR' && (
                <>
                  <MetricCard title="My Balance" value="$32,400" change="+2.5%" icon={Wallet} />
                  <MetricCard title="Total Profit" value="12.4%" change="+1.2%" icon={TrendingUp} />
                  <MetricCard title="Goal Projection" value="$100k" change="On Track" icon={Target} />
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