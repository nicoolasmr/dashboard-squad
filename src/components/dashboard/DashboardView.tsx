"use client";

import React from "react";
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Clock,
    AlertCircle,
    PieChart as PieChartIcon,
    BarChart3,
    Zap,
    ArrowUp
} from "lucide-react";
import { KPICard } from "@/components/ui/kpi-card";
import { DashboardData, Transaction } from "@/types/dashboard";
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
} from "recharts";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardViewProps {
    data: DashboardData | null;
    loading: boolean;
    isTVMode: boolean;
    lastSync: Date;
    onViewSales?: () => void;
    onViewMeetings?: () => void;
    onViewFinance?: () => void;
}

const COLORS = ["#0066ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];


// Generate dynamic labels and values for the last 14 days
function getChartData(transactions: Transaction[]) {
    const dataMap: Record<string, { receita: number; despesas: number }> = {};
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        dataMap[label] = { receita: 0, despesas: 0 };
    }

    transactions.forEach(t => {
        const dateStr = new Date(t.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        if (dataMap[dateStr]) {
            if (t.tipo === 'RECEITA' && t.status === 'APROVADO') {
                dataMap[dateStr].receita += t.valor;
            } else if (t.tipo === 'DESPESA' || t.tipo === 'CUSTO') {
                dataMap[dateStr].despesas += t.valor;
            }
        }
    });

    return Object.entries(dataMap).map(([name, vals]) => ({
        name,
        ...vals
    }));
}

export function DashboardView({ data, loading, isTVMode, lastSync, onViewSales, onViewMeetings, onViewFinance }: DashboardViewProps) {
    const kpis = data?.kpis;
    const transactions = data?.transactions || [];
    const meetings = data?.meetings || [];

    // Dynamic aggregation for Revenue Origin (Include ALL Approved Revenue)
    const originStats = transactions
        .filter(t => t.tipo === 'RECEITA' && t.status === 'APROVADO')
        .reduce((acc, curr) => {
            const origin = (curr.origem || 'OUTRO').toUpperCase();
            acc[origin] = (acc[origin] || 0) + Number(curr.valor);
            return acc;
        }, {} as Record<string, number>);

    const originChartData = Object.entries(originStats).map(([name, value]) => ({
        name,
        value
    })).sort((a, b) => b.value - a.value);

    // Default if no data
    const displayOriginData = originChartData.length > 0 ? originChartData : [
        { name: "Sem Dados", value: 1 }
    ];

    const recentSales = transactions
        .filter(t => t.tipo === 'RECEITA')
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 4);

    const todayMeetings = meetings
        .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
        .slice(0, 3);

    const chartData = getChartData(transactions);

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header section with glassmorphism accent */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">Centro de Comando</h1>
                    <p className="text-muted-foreground mt-2 text-base font-medium">Sincronizado {Math.floor((new Date().getTime() - lastSync.getTime()) / 60000) === 0 ? 'agora' : `há ${Math.floor((new Date().getTime() - lastSync.getTime()) / 60000)} minutos`}.</p>
                </div>
                <div className="flex items-center gap-3 bg-card/40 border border-border/40 p-2 pr-6 rounded-2xl backdrop-blur-md shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                        <Zap size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Status do Sync</p>
                        <p className="text-sm font-black text-foreground">{lastSync.toLocaleTimeString("pt-BR")}</p>
                    </div>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Receita Aprovada"
                    value={kpis?.receita_aprovada || 0}
                    type="currency"
                    trend={0}
                    icon={<TrendingUp size={24} />}
                    loading={loading}
                    onClick={onViewSales}
                />
                <KPICard
                    title="Receita Total"
                    value={kpis?.receita_total || 0}
                    type="currency"
                    trend={0}
                    icon={<DollarSign size={24} />}
                    loading={loading}
                    onClick={onViewSales}
                />
                <KPICard
                    title="Custo Operacional"
                    value={kpis?.custos_total || 0}
                    type="currency"
                    trend={0}
                    icon={<ShoppingCart size={24} />}
                    loading={loading}
                    onClick={onViewFinance}
                />
                <KPICard
                    title="Lucro Líquido"
                    value={kpis?.lucro || 0}
                    type="currency"
                    trend={0}
                    icon={<BarChart3 size={24} />}
                    loading={loading}
                    onClick={onViewFinance}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[2.5rem] border-border/60 shadow-premium overflow-hidden bg-card/60 backdrop-blur-sm">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Performance Financeira</CardTitle>
                            <CardDescription className="font-medium">Fluxo de caixa consolidado (últimos 14 dias)</CardDescription>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" /> Receita
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter">
                                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30 shadow-sm" /> Despesas
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="h-[350px] w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0066ff" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#0066ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        contentStyle={{ backgroundColor: "var(--card)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)", padding: "12px 16px" }}
                                        formatter={(val: any) => [formatCurrency(Number(val)), "Valor"]}
                                        labelStyle={{ fontWeight: 800, marginBottom: "4px", color: "var(--foreground)" }}
                                    />
                                    <Area type="monotone" dataKey="receita" stroke="#0066ff" strokeWidth={4} fillOpacity={1} fill="url(#colorRec)" animationDuration={2000} />
                                    <Area type="monotone" dataKey="despesas" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" fill="transparent" animationDuration={2000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-border/60 shadow-premium overflow-hidden bg-card/60 backdrop-blur-sm">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <PieChartIcon size={20} className="text-primary" />
                            Origem das Receitas
                        </CardTitle>
                        <CardDescription className="font-medium">Distribuição por plataforma</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[280px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={displayOriginData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={100}
                                        paddingAngle={10}
                                        dataKey="value"
                                        stroke="none"
                                        animationDuration={1500}
                                    >
                                        {displayOriginData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                                        formatter={(val: any) => formatCurrency(Number(val))}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Total</p>
                                <p className="text-2xl font-black text-foreground">
                                    {formatCurrency(displayOriginData.reduce((a, b) => a + (b.value || 0), 0))}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            {displayOriginData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                        <span className="text-xs font-bold text-foreground/80 uppercase tracking-tight">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-foreground">{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
                <Card className="rounded-[2.5rem] border-border/60 shadow-premium overflow-hidden bg-card/40 backdrop-blur-md">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <ShoppingCart size={20} className="text-primary" />
                                Vendas Recentes
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            className="rounded-xl font-bold gap-2 text-primary hover:bg-primary/5 h-8 px-3"
                            onClick={onViewSales}
                        >
                            Ver Todas <ArrowUp size={14} className="rotate-45" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 space-y-4">
                        {recentSales.map((sale) => (
                            <div
                                key={sale.id}
                                onClick={onViewSales}
                                className="group flex items-center justify-between p-5 bg-muted/20 hover:bg-muted/40 rounded-2xl border border-border/50 transition-all duration-300 cursor-pointer hover:border-primary/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black group-hover:scale-105 transition-transform border border-primary/10">
                                        {sale.nome?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">{sale.nome}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{sale.produto}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-foreground">{formatCurrency(sale.valor)}</p>
                                    <Badge variant="success" className="h-4 text-[9px] font-black uppercase rounded-sm border-none bg-success/20 text-success">
                                        {sale.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-border/60 shadow-premium overflow-hidden bg-card/40 backdrop-blur-md">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <Clock size={20} className="text-success" />
                                Próximas Reuniões
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            className="rounded-xl font-bold gap-2 text-success hover:bg-success/5 h-8 px-3"
                            onClick={onViewMeetings}
                        >
                            Ver Agenda <ArrowUp size={14} className="rotate-45" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 space-y-4">
                        {todayMeetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                onClick={onViewMeetings}
                                className="group flex items-center justify-between p-5 bg-muted/20 hover:bg-muted/40 rounded-2xl border border-border/50 transition-all duration-300 cursor-pointer hover:border-success/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-success/10">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground leading-tight">{meeting.titulo}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase italic">Cliente: {meeting.cliente}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-foreground">{formatDate(meeting.data_hora)}</p>
                                    <Badge variant="primary" className="h-4 text-[9px] font-black uppercase rounded-sm border-none bg-primary/20 text-primary">
                                        {meeting.canal}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
