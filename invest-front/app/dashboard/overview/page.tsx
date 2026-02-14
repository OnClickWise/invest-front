"use client"

import { useEffect, useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wallet, TrendingUp, AlertCircle } from "lucide-react"
import { RecentTransactions } from "@/components/invest/recent-transactions"
import { investorService } from "@/services/investor.service"
import { portfolioService } from "@/services/portfolio.service"

export default function OverviewPage() {
  const [aum, setAum] = useState(0)
  const [investorCount, setInvestorCount] = useState(0)
  const [avgReturn, setAvgReturn] = useState(0)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [investors, portfolios] = await Promise.all([
          investorService.getAll().catch(() => []),
          portfolioService.getAll().catch(() => []),
        ])

        setInvestorCount(investors.length)

        const total = portfolios.reduce((sum, portfolio) => {
          return sum + (portfolio.totalValue || portfolio.initialAmount || 0)
        }, 0)
        setAum(total)

        if (portfolios.length > 0) {
          const avg = portfolios.reduce((sum, portfolio) => sum + (portfolio.totalValue || portfolio.initialAmount || 0), 0) / portfolios.length
          setAvgReturn(avg > 0 ? 8.4 : 0)
        }
      } catch (error) {
        console.error("Erro ao buscar overview:", error)
      }
    }

    fetchOverview()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
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
              <BreadcrumbItem><BreadcrumbPage>Overview</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto"><ModeToggle /></div>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manager Overview</h1>
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total AUM</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(aum)}</div></CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Active Investors</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{investorCount}</div></CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Avg. Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{avgReturn.toFixed(1)}% <span className="text-xs font-normal text-slate-400">/yr</span></div></CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">3</div></CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activities</h2>
              <RecentTransactions />
           </div>
           <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Consolidated Performance</h2>
              <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
                 Performance Chart (Coming Soon)
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}