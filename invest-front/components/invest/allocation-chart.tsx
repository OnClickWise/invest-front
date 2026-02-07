"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Dados fictícios da carteira
const data = [
  { name: "Renda Fixa", value: 45, color: "#3b82f6" }, 
  { name: "Ações BR", value: 25, color: "#10b981" },   
  { name: "FIIs", value: 15, color: "#f59e0b" },       
  { name: "Cripto", value: 5, color: "#8b5cf6" },      
  { name: "Exterior", value: 10, color: "#ec4899" },   
]

export function AllocationChart() {
  return (
    <Card className="bg-slate-950 border-slate-800 text-slate-200 shadow-xl flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-white">Alocação de Ativos</CardTitle>
        <CardDescription className="text-slate-400">Distribuição atual da carteira</CardDescription>
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
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.1)" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
              formatter={(value: any) => `${value}%`}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="circle"
              formatter={(value) => <span className="text-slate-300 text-xs ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}