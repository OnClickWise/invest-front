import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"

const transactions = [
  { 
    id: "1", 
    type: "deposit", 
    amount: "+ $500.00", 
    date: "Hoje, 10:23", 
    label: "Aporte Mensal", 
    icon: ArrowUpRight, 
    color: "text-emerald-700 dark:text-emerald-400", 
    bg: "bg-emerald-100 dark:bg-emerald-500/10" 
  },
  { 
    id: "2", 
    type: "dividend", 
    amount: "+ $25.40", 
    date: "Ontem, 09:15", 
    label: "Dividendos AAPL", 
    icon: RefreshCw, 
    color: "text-blue-700 dark:text-blue-400", 
    bg: "bg-blue-100 dark:bg-blue-500/10" 
  },
  { 
    id: "3", 
    type: "withdrawal", 
    amount: "- $30.00", 
    date: "05 Set, 14:00", 
    label: "Taxa de Custódia", 
    icon: ArrowDownRight, 
    color: "text-rose-700 dark:text-rose-400", 
    bg: "bg-rose-100 dark:bg-rose-500/10" 
  },
  { 
    id: "4", 
    type: "deposit", 
    amount: "+ $1,000.00", 
    date: "01 Set, 08:30", 
    label: "Aporte Extra", 
    icon: ArrowUpRight, 
    color: "text-emerald-700 dark:text-emerald-400", 
    bg: "bg-emerald-100 dark:bg-emerald-500/10" 
  },
]

export function RecentTransactions() {
  return (
    <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Últimas Movimentações</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">Histórico recente da conta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {transactions.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                <item.icon size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{item.label}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            </div>
            <div className={`text-sm font-bold ${item.type === 'withdrawal' ? 'text-slate-600 dark:text-slate-300' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {item.amount}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}