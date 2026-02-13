"use client"

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "next-themes";

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [initial, setInitial] = useState(20000); 
  const [monthly, setMonthly] = useState(500);   
  const [rate, setRate] = useState(8);           
  const [years, setYears] = useState(10);         
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = generateProjectionData(initial, monthly, rate, years);
  const finalAmount = data[data.length - 1].saldo;

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  const colors = {
    grid: isDark ? "#334155" : "#e2e8f0",
    axis: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#0f172a" : "#ffffff",
    tooltipBorder: isDark ? "#1e293b" : "#e2e8f0",
    tooltipText: isDark ? "#f8fafc" : "#0f172a",
    areaStroke: isDark ? "#3b82f6" : "#2563eb",
    lineInvested: isDark ? "#64748b" : "#94a3b8"
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Simulador Pro</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Ajuste os valores abaixo:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-300">Capital Inicial ($)</Label>
            <Input 
              type="number" 
              value={initial} 
              onChange={(e) => setInitial(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Aporte Mensal ($)</Label>
              <Input 
                type="number" 
                value={monthly} 
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500"
              />
            </div>
            <Slider 
              value={[monthly]} 
              max={10000} 
              step={50} 
              onValueChange={(val) => setMonthly(val[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-300">Rentabilidade Anual (%)</Label>
            <Input 
              type="number" 
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500"
            />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-4">
             <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Patrimônio Projetado</p>
             <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
               {formatCurrency(finalAmount)}
             </p>
             <p className="text-xs text-slate-500 mt-2">Em {years} anos</p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Curva de Evolução</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] w-full min-w-0">
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.areaStroke} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.areaStroke} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="year" stroke={colors.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke={colors.axis} 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${val/1000}k`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: '8px', color: colors.tooltipText }}
                  formatter={(value: any) => formatCurrency(value)}
                  labelStyle={{ color: colors.axis }}
                />
                <Area type="monotone" dataKey="saldo" name="Saldo Total" stroke={colors.areaStroke} strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
                <Line type="monotone" dataKey="investido" name="Total Investido" stroke={colors.lineInvested} strokeWidth={2} dot={false} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}