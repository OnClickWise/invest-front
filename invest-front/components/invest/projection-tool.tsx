"use client"

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const generateProjectionData = (initial: number, monthly: number, rate: number, years: number) => {
  const data = [];
  let currentBalance = initial;
  let totalInvested = initial;
  const monthlyRate = rate / 100 / 12; 
  const currentYear = new Date().getFullYear();

  for (let year = 0; year <= years; year++) {
    data.push({
      year: currentYear + year,
      saldo: Math.round(currentBalance),
      investido: Math.round(totalInvested),
    });

    for (let m = 0; m < 12; m++) {
      currentBalance = currentBalance * (1 + monthlyRate) + monthly;
      totalInvested += monthly;
    }
  }
  return data;
};

export function ProjectionTool() {
  const [initial, setInitial] = useState(100000); 
  const [monthly, setMonthly] = useState(2500);   
  const [rate, setRate] = useState(12);           
  const [years, setYears] = useState(10);         
  
  const data = generateProjectionData(initial, monthly, rate, years);
  const finalAmount = data[data.length - 1].saldo;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bg-slate-950 border-slate-800 text-slate-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Simulador Pro</CardTitle>
          <CardDescription className="text-slate-400">Ajuste os valores abaixo:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Capital Inicial (R$)</Label>
            <Input 
              type="number" 
              value={initial} 
              onChange={(e) => setInitial(Number(e.target.value))}
              className="bg-slate-900 border-slate-700 text-white focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Aporte Mensal (R$)</Label>
              <Input 
                type="number" 
                value={monthly} 
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white focus:border-blue-500"
              />
            </div>
            <Slider 
              value={[monthly]} 
              max={50000} 
              step={100} 
              onValueChange={(val) => setMonthly(val[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Rentabilidade Anual (%)</Label>
            <Input 
              type="number" 
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-slate-900 border-slate-700 text-white focus:border-blue-500"
            />
          </div>

          <div className="pt-6 border-t border-slate-800 mt-4">
             <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Patrimônio Projetado</p>
             <p className="text-3xl font-bold text-emerald-400 mt-1">
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalAmount)}
             </p>
             <p className="text-xs text-slate-500 mt-2">Em {years} anos</p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-slate-950 border-slate-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Curva de Evolução</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] w-full min-w-0">
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `R$${val/1000}k`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="saldo" name="Saldo Total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
                <Line type="monotone" dataKey="investido" name="Total Investido" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}