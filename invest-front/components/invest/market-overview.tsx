"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getBrazilianMarketData } from "@/lib/brapi"

interface MarketItem {
  symbol: string
  name: string
  price: string
  changePercent: number
}

// Dados padrão caso a API falhe
const defaultCurrencies: MarketItem[] = [
  { symbol: "USD/BRL", name: "Dólar", price: "4.87", changePercent: 0.41 },
  { symbol: "EUR/BRL", name: "Euro", price: "5.32", changePercent: -0.19 },
  { symbol: "BTC/BRL", name: "Bitcoin", price: "245.380", changePercent: 1.17 },
  { symbol: "ETH/BRL", name: "Ethereum", price: "12.850", changePercent: 0.85 },
]

const defaultStocks: MarketItem[] = [
  { symbol: "PETR4", name: "Petrobras", price: "38.45", changePercent: 2.26 },
  { symbol: "VALE3", name: "Vale", price: "62.18", changePercent: -0.51 },
  { symbol: "ITUB4", name: "Itaú", price: "28.92", changePercent: 0.52 },
  { symbol: "BBDC4", name: "Bradesco", price: "14.76", changePercent: 0.54 },
]

function MarketItemRow({ item }: { item: MarketItem }) {
  const isPositive = item.changePercent >= 0

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-900 dark:text-white truncate">
          {item.symbol}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {item.name}
        </div>
      </div>
      <div className="text-right ml-2">
        <div className="font-semibold text-sm text-slate-900 dark:text-white">
          {item.price}
        </div>
        <div className={`flex items-center gap-0.5 justify-end text-xs font-medium ${
          isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        }`}>
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export function MarketOverview() {
  const [currencies, setCurrencies] = useState<MarketItem[]>(defaultCurrencies)
  const [stocks, setStocks] = useState<MarketItem[]>(defaultStocks)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchMarketData = async () => {
    setLoading(true)
    try {
      const data = await getBrazilianMarketData()
      if (data) {
        if (data.currencies.length > 0) setCurrencies(data.currencies)
        if (data.stocks.length > 0) setStocks(data.stocks)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Busca dados ao montar o componente
    fetchMarketData()

    // Atualiza a cada 1 minuto (Brapi tem limite mais generoso)
    const interval = setInterval(fetchMarketData, 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Carregando...'
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000 / 60)
    if (diff < 1) return 'Agora'
    if (diff === 1) return 'Há 1 minuto'
    return `Há ${diff} minutos`
  }

  return (
    <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
            <CardTitle className="text-slate-900 dark:text-white">Mercado Financeiro</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMarketData}
              disabled={loading}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
              title="Atualizar cotações"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Tempo Real
            </Badge>
          </div>
        </div>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Cotações B3 via Brapi
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            💰 Moedas & Crypto
          </h3>
          <div className="space-y-0.5">
            {currencies.map((currency) => (
              <MarketItemRow key={currency.symbol} item={currency} />
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
          <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
            📈 Ações B3
          </h3>
          <div className="space-y-0.5">
            {stocks.map((stock) => (
              <MarketItemRow key={stock.symbol} item={stock} />
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          {formatLastUpdate()}
        </div>
      </CardContent>
    </Card>
  )
}
