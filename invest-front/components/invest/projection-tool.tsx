"use client"

import React, { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { investorService, Investor } from "@/services/investor.service";
import { reportService, ProjectionResponse } from "@/services/report.service";
import { Loader2 } from "lucide-react";

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

type ProjectionToolProps = {
  showInvestorSelect?: boolean;
};

export function ProjectionTool({ showInvestorSelect = false }: ProjectionToolProps) {
  const { resolvedTheme } = useTheme();
  const { user, role } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [initial, setInitial] = useState(20000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const [investors, setInvestors] = useState<Investor[]>([]);
  const [selectedInvestorId, setSelectedInvestorId] = useState("");
  const [projection, setProjection] = useState<ProjectionResponse | null>(null);
  const [projectionLoading, setProjectionLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let isActive = true;
    const fetchInvestors = async () => {
      try {
        const data = await investorService.getAll().catch(() => []);
        if (!isActive) return;
        setInvestors(data);

        setSelectedInvestorId((current) => {
          if (current) return current;
          if (role === "INVESTOR" && user?.email) {
            const investor = data.find((item) => item.email === user.email);
            return investor?.id || "";
          }
          return data[0]?.id || "";
        });
      } catch (error) {
        console.error("Erro ao buscar investidores:", error);
      }
    };

    fetchInvestors();

    return () => {
      isActive = false;
    };
  }, [mounted, role, user?.email]);

  useEffect(() => {
    if (!mounted || !selectedInvestorId) {
      setProjection(null);
      return;
    }

    const timer = setTimeout(async () => {
      setProjectionLoading(true);
      try {
        const result = await reportService.generateProjection({
          investorId: selectedInvestorId,
          initialCapital: initial,
          monthlyContribution: monthly,
          years,
          scenarios: [
            {
              name: "Base",
              annualRate: rate,
            },
          ],
        });
        setProjection(result);
      } catch (error) {
        console.error("Erro ao gerar projecao:", error);
        setProjection(null);
      } finally {
        setProjectionLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [mounted, selectedInvestorId, initial, monthly, rate, years]);

  const fallbackData = useMemo(
    () => generateProjectionData(initial, monthly, rate, years),
    [initial, monthly, rate, years]
  );

  const apiScenario = projection?.scenarios?.[0];
  const labels = projection?.labels?.length
    ? projection.labels
    : fallbackData.map((item) => String(item.year));

  const chartData = labels.map((label, idx) => {
    const fallback = fallbackData[idx] || fallbackData[fallbackData.length - 1];
    return {
      label,
      saldo: apiScenario?.data?.[idx] ?? fallback?.saldo ?? 0,
      investido: fallback?.investido ?? 0,
    };
  });

  const finalAmount = apiScenario?.kpis?.finalAmount ?? chartData[chartData.length - 1]?.saldo ?? 0;

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const colors = {
    grid: isDark ? "#334155" : "#e2e8f0",
    axis: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#0f172a" : "#ffffff",
    tooltipBorder: isDark ? "#1e293b" : "#e2e8f0",
    tooltipText: isDark ? "#f8fafc" : "#0f172a",
    areaStroke: isDark ? "#3b82f6" : "#2563eb",
    lineInvested: isDark ? "#64748b" : "#94a3b8",
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Simulador Pro</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">Ajuste os valores abaixo:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showInvestorSelect && role !== "INVESTOR" && (
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Investidor</Label>
              <select
                value={selectedInvestorId}
                onChange={(event) => setSelectedInvestorId(event.target.value)}
                className="h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-white"
              >
                {investors.map((investor) => (
                  <option key={investor.id} value={investor.id}>
                    {investor.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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

          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-300">Horizonte (anos)</Label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-blue-500"
            />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Patrimonio Projetado</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(finalAmount)}
            </p>
            <p className="text-xs text-slate-500 mt-2">Em {years} anos</p>
            {projectionLoading && (
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Atualizando...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Curva de Evolucao</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] w-full min-w-0">
          <div style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.areaStroke} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.areaStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="label" stroke={colors.axis} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={colors.axis}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.tooltipBorder, borderRadius: "8px", color: colors.tooltipText }}
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