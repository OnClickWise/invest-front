import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, RefreshCw } from "lucide-react"

// Dados fictícios de transações
const transactions = [
  {
    id: "1",
    type: "deposit",
    amount: "+ R$ 2.500,00",
    date: "Hoje, 10:23",
    label: "Aporte Mensal",
    icon: ArrowUpRight,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "2",
    type: "dividend",
    amount: "+ R$ 145,20",
    date: "Ontem, 09:15",
    label: "Dividendos HGLG11",
    icon: RefreshCw,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "3",
    type: "withdrawal",
    amount: "- R$ 150,00",
    date: "05 Set, 14:00",
    label: "Pagamento Taxa B3",
    icon: ArrowDownRight,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    id: "4",
    type: "deposit",
    amount: "+ R$ 5.000,00",
    date: "01 Set, 08:30",
    label: "Aporte Extra",
    icon: ArrowUpRight,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
]

export function RecentTransactions() {
  return (
    <Card className="bg-slate-950 border-slate-800 text-slate-200 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-white">Últimas Movimentações</CardTitle>
        <CardDescription className="text-slate-400">Histórico recente da conta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {transactions.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                <item.icon size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white leading-none">{item.label}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            </div>
            <div className={`text-sm font-bold ${item.type === 'withdrawal' ? 'text-slate-200' : 'text-emerald-400'}`}>
              {item.amount}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}