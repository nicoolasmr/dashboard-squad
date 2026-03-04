"use client";

import React from "react";
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Clock,
    AlertCircle,
    PieChart as PieChartIcon,
    BarChart3
} from "lucide-react";
import { KPICard } from "@/components/ui/KPICard";
import { DashboardData } from "@/types/dashboard";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DashboardViewProps {
    data: DashboardData | null;
    loading: boolean;
    isTVMode: boolean;
    lastSync: Date;
}

const COLORS = ["#0066ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Mock data for charts
const REVENUE_DATA = [
    { name: "20/02", receita: 4000, despesas: 2400 },
    { name: "21/02", receita: 3000, despesas: 1398 },
    { name: "22/02", receita: 2000, despesas: 9800 },
    { name: "23/02", receita: 2780, despesas: 3908 },
    { name: "24/02", receita: 1890, despesas: 4800 },
    { name: "25/02", receita: 2390, despesas: 3800 },
    { name: "26/02", receita: 3490, despesas: 4300 },
];

const ORIGIN_DATA = [
    { name: "Kiwify", value: 400 },
    { name: "Hotmart", value: 300 },
    { name: "Stripe", value: 300 },
    { name: "Manual", value: 200 },
];

export function DashboardView({ data, loading, isTVMode, lastSync }: DashboardViewProps) {
    const kpis = data?.kpis;

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
                    <p className="text-muted-foreground mt-1">Bem-vindo ao centro de comando operacional.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Sincronizado</p>
                    <p className="text-sm font-bold">{lastSync.toLocaleTimeString("pt-BR")}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Receita Aprovada"
                    value={kpis?.receita_aprovada || 0}
                    type="currency"
                    trend={12}
                    icon={<TrendingUp size={24} />}
                    loading={loading}
                />
                <KPICard
                    title="Receita Total"
                    value={kpis?.receita_total || 0}
                    type="currency"
                    trend={8}
                    icon={<DollarSign size={24} />}
                    loading={loading}
                />
                <KPICard
                    title="Total Despesas"
                    value={kpis?.despesas_total || 0}
                    type="currency"
                    trend={-5}
                    icon={<AlertCircle size={24} />}
                    loading={loading}
                />
                <KPICard
                    title="Lucro Líquido"
                    value={kpis?.lucro || 0}
                    type="currency"
                    trend={15}
                    icon={<BarChart3 size={24} />}
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-border shadow-premium">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold">Fluxo de Caixa (14 dias)</h3>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Receita</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" /> Despesas</div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0066ff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0066ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                                    formatter={(val: number | string) => formatCurrency(Number(val))}
                                />
                                <Area type="monotone" dataKey="receita" stroke="#0066ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" />
                                <Area type="monotone" dataKey="despesas" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-3xl border border-border shadow-premium">
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                        <PieChartIcon size={18} className="text-primary" />
                        Origem das Receitas
                    </h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ORIGIN_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {ORIGIN_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {ORIGIN_DATA.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-3xl border border-border shadow-premium">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ShoppingCart size={18} className="text-primary" />
                        Vendas Recentes
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">JD</div>
                                    <div>
                                        <p className="text-sm font-bold">John Doe</p>
                                        <p className="text-xs text-muted-foreground">Produto Premium #0{i}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">R$ 1.490,00</p>
                                    <p className="text-[10px] uppercase font-bold text-success">Aprovado</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card p-6 rounded-3xl border border-border shadow-premium">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-primary" />
                        Reuniões de Hoje
                    </h3>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Briefing de Projeto</p>
                                        <p className="text-xs text-muted-foreground">Cliente: Squad Corp</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">14:00</p>
                                    <p className="text-[10px] uppercase font-bold text-primary">Zoom</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
