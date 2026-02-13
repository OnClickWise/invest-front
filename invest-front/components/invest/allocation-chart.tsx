"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTheme } from "next-themes"

// Dados de exemplo adaptados para contexto internacional (USD)
const data = [
  { name: "Treasuries (Renda Fixa)", value: 40, color: "#3b82f6" }, // Blue
  { name: "Stocks US", value: 30, color: "#10b981" },               // Emerald
  { name: "REITs (Imóveis)", value: 15, color: "#f59e0b" },         // Amber
  { name: "Crypto", value: 5, color: "#8b5cf6" },                   // Violet
  { name: "Cash / Caixa", value: 10, color: "#ec4899" },            // Pink
]

export function AllocationChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Necessário para evitar erro de hidratação com temas
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  
  // Configuração de cores baseada no tema
  const chartConfig = {
    tooltipBg: isDark ? "#0f172a" : "#ffffff",
    tooltipBorder: isDark ? "#1e293b" : "#e2e8f0",
    tooltipText: isDark ? "#f8fafc" : "#0f172a",
    legendText: isDark ? "#cbd5e1" : "#475569",
    // A borda da fatia deve ter a mesma cor do fundo do card para dar efeito de separação
    sliceStroke: isDark ? "#020617" : "#ffffff" 
  };

  return (
    <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-sm flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-slate-900 dark:text-white">Alocação de Ativos</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">Distribuição atual da carteira (USD)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60} // Estilo Donut
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={chartConfig.sliceStroke} 
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: chartConfig.tooltipBg, 
                borderColor: chartConfig.tooltipBorder, 
                borderRadius: '8px', 
                color: chartConfig.tooltipText,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: chartConfig.tooltipText }}
              formatter={(value: any) => `${value}%`}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="circle"
              formatter={(value) => <span style={{ color: chartConfig.legendText }} className="text-xs ml-1 font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}