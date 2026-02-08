"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTheme } from "next-themes"

const data = [
  { name: "Renda Fixa", value: 45, color: "#3b82f6" },
  { name: "Ações BR", value: 25, color: "#10b981" }, 
  { name: "FIIs", value: 15, color: "#f59e0b" },     
  { name: "Cripto", value: 5, color: "#8b5cf6" },    
  { name: "Exterior", value: 10, color: "#ec4899" }, 
]

export function AllocationChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  
  const colors = {
    tooltipBg: isDark ? "#0f172a" : "#ffffff",
    tooltipBorder: isDark ? "#1e293b" : "#e2e8f0",
    tooltipText: isDark ? "#ffffff" : "#0f172a",
    legendText: isDark ? "#cbd5e1" : "#475569"
  };

  return (
    <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-sm flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-slate-900 dark:text-white">Alocação de Ativos</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">Distribuição atual da carteira</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? "rgba(0,0,0,0.2)" : "#fff"} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px', color: colors.tooltipText }}
              formatter={(value: any) => `${value}%`}
              itemStyle={{ color: colors.tooltipText }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="circle"
              formatter={(value) => <span style={{ color: colors.legendText }} className="text-xs ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}