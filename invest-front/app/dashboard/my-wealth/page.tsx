"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { investorService } from "@/services/investor.service"
import { portfolioService } from "@/services/portfolio.service"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { AllocationChart } from "@/components/invest/allocation-chart"
import { RecentTransactions } from "@/components/invest/recent-transactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, PiggyBank } from "lucide-react"

export default function MyWealthPage() {
  const { user } = useAuth()
  const [totalBalance, setTotalBalance] = useState(0)
  const [cashAvailable, setCashAvailable] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)

  useEffect(() => {
    const fetchWealth = async () => {
      try {
        if (!user?.email) return

        const investors = await investorService.getAll().catch(() => [])
        const investor = investors.find((item) => item.email === user.email)
        if (!investor) return

        const portfolios = await portfolioService.getByInvestor(investor.id)
        const total = portfolios.reduce((sum, portfolio) => sum + (portfolio.totalValue || portfolio.initialAmount || 0), 0)
        setTotalBalance(total)
        setCashAvailable(Math.max(0, total * 0.05))
        setTotalProfit(total * 0.138)
      } catch (error) {
        console.error("Erro ao carregar patrimonio:", error)
      }
    }

    fetchWealth()
  }, [user])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-slate-500 dark:text-slate-400" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-300 dark:bg-slate-800" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>My Wealth</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto"><ModeToggle /></div>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Portfolio</h1>

        <div className="grid gap-4 md:grid-cols-3">
           <Card className="bg-emerald-600 border-none shadow-md text-white">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-emerald-100">Total Balance</CardTitle>
               <Wallet className="h-4 w-4 text-emerald-100" />
             </CardHeader>
             <CardContent><div className="text-3xl font-bold">{formatCurrency(totalBalance)}</div></CardContent>
           </Card>
           <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Total Profit</CardTitle>
               <TrendingUp className="h-4 w-4 text-emerald-500" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-slate-900 dark:text-white">+ {formatCurrency(totalProfit)}</div>
               <p className="text-xs text-emerald-500">+13.8% all time</p>
             </CardContent>
           </Card>
           <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Cash Available</CardTitle>
               <PiggyBank className="h-4 w-4 text-blue-500" />
             </CardHeader>
             <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(cashAvailable)}</div></CardContent>
           </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <AllocationChart />
           <RecentTransactions />
        </div>
      </div>
    </div>
  )
}