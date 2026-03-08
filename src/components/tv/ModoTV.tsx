"use client";

import React, { useState, useEffect } from "react";
import { DashboardData } from "@/types/dashboard";
import { TrendingUp, DollarSign, BarChart3, Clock, RefreshCw, X, Maximize2, Zap, Activity, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals, goalProgress, progressColor } from "@/hooks/useGoals";

interface ModoTVProps {
    data: DashboardData | null;
    loading: boolean;
    lastSync: Date;
}

export function ModoTV({ data, loading, lastSync }: ModoTVProps) {
    const [activeView, setActiveView] = useState(0);
    const router = useRouter();
    const views = ["OPERATIONAL OVERVIEW", "SALES PIPELINE", "FINANCIAL METRICS"];
    const kpis = data?.kpis;
    const currentMes = new Date().toISOString().slice(0, 7);
    const { data: txData } = useTransactions("RECEITA");
    const { goal } = useGoals(currentMes);
    const receitaReal = txData.filter(t => t.status === 'APROVADO').reduce((s, t) => s + t.valor, 0);
    const metaReceita = goal?.meta_receita ?? 0;
    const pct = metaReceita > 0 ? Math.min(100, Math.round((receitaReal / metaReceita) * 100)) : 0;
    const barColor = progressColor(pct);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveView((prev) => (prev + 1) % views.length);
        }, 15000);
        return () => clearInterval(interval);
    }, [views.length]);

    const exitTVMode = () => {
        router.push("/");
    };

    return (
        <div className="fixed inset-0 bg-[#050505] text-white z-[200] flex flex-col p-12 overflow-hidden selection:bg-primary selection:text-white">
            {/* Cyberpunk Grid Background Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* TV Header - Futuristic Style */}
            <div className="relative z-10 flex justify-between items-start border-b border-white/10 pb-10">
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-[0_0_30px_rgba(0,102,255,0.4)]">S</div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-4 border-[#050505] animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                            Squad <span className="text-primary">Control</span>
                        </h1>
                        <div className="flex gap-6 mt-3">
                            {views.map((v, i) => (
                                <button
                                    key={v}
                                    onClick={() => setActiveView(i)}
                                    className="flex flex-col gap-1 text-left outline-none group"
                                >
                                    <span className={cn(
                                        "text-[10px] font-black tracking-[0.2em] transition-all duration-700",
                                        activeView === i ? "text-primary opacity-100" : "text-white opacity-20 group-hover:opacity-50"
                                    )}>
                                        {v}
                                    </span>
                                    <div className={cn(
                                        "h-0.5 rounded-full transition-all duration-700",
                                        activeView === i ? "bg-primary w-full" : "bg-white/10 w-4 group-hover:w-8"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">System Entropy</p>
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-primary animate-pulse" />
                            <span className="text-2xl font-mono font-bold tabular-nums">0.042ms</span>
                        </div>
                    </div>

                    <div className="h-14 w-px bg-white/10" />

                    <div className="text-right">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Local Node Time</p>
                        <p className="text-3xl font-mono font-black tracking-tighter tabular-nums">
                            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={exitTVMode}
                        className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 hover:bg-destructive hover:text-white transition-all group relative z-[210]"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex-grow flex flex-col mt-12">
                <AnimatePresence mode="wait">
                    {activeView === 0 && (
                        <motion.div
                            key="geral"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="grid grid-cols-12 gap-12 flex-grow"
                        >
                            {/* Giant KPI Block */}
                            <div className="col-span-8 flex flex-col gap-12">
                                <div className="bg-gradient-to-br from-white/5 to-transparent p-16 rounded-[4rem] border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-20 -mt-20 group-hover:bg-primary/20 transition-all duration-1000" />
                                    <div className="relative z-10">
                                        <p className="text-3xl font-black text-white/40 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary animate-ping opacity-20 absolute" />
                                            <div className="w-8 h-8 rounded-full bg-primary relative" />
                                            Total Approved Revenue
                                        </p>
                                        <h2 className="text-[clamp(3.5rem,8vw,14rem)] font-black tracking-[-0.06em] leading-none mb-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 whitespace-nowrap overflow-visible">
                                            {formatCurrency(kpis?.receita_aprovada || 0).split(',')[0]}
                                            <span className="text-[0.4em] text-white/20">,{formatCurrency(kpis?.receita_aprovada || 0).split(',')[1]}</span>
                                        </h2>
                                        <div className="flex items-center gap-8">
                                            <Badge className="text-4xl px-10 py-4 rounded-3xl bg-success text-white font-black">
                                                {pct}%
                                            </Badge>
                                            <div className="flex-grow h-4 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="h-full shadow-[0_0_20px_rgba(0,102,255,0.5)]"
                                                    style={{ backgroundColor: barColor }}
                                                />
                                            </div>
                                            <span className="text-3xl font-black opacity-40">{pct}% OF GOAL</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 flex-grow mb-12">
                                    <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 flex flex-col justify-center">
                                        <p className="text-xl font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Daily Velocity</p>
                                        <div className="flex items-baseline gap-4">
                                            <h3 className="text-8xl font-black tracking-tighter">
                                                {(receitaReal / Math.max(1, new Date().getDate())).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k
                                            </h3>
                                            <span className="text-2xl font-bold text-success">/DAY</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 flex flex-col justify-center">
                                        <p className="text-xl font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Pending Authorization</p>
                                        <div className="flex items-baseline gap-4">
                                            <h3 className="text-8xl font-black tracking-tighter text-warning">{kpis?.pendentes_qtd}</h3>
                                            <span className="text-2xl font-bold text-white/20 uppercase tracking-widest leading-none">Trans.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Detail Block */}
                            <div className="col-span-4 bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 flex flex-col mb-12">
                                <p className="text-xl font-bold text-white/30 uppercase tracking-[0.4em] mb-12 flex items-center justify-between">
                                    Live Ops
                                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                                </p>
                                <div className="space-y-10">
                                    {(data?.transactions || [])
                                        .filter(t => t.tipo === 'RECEITA')
                                        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                                        .slice(0, 4)
                                        .map((t, i) => (
                                            <div key={t.id || i} className="flex gap-8 group">
                                                <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-border/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Zap className="text-primary" size={32} />
                                                </div>
                                                <div className="flex flex-col justify-center gap-1">
                                                    <p className="text-3xl font-black leading-none uppercase tracking-tighter line-clamp-1">{t.nome || "New Conversion"}</p>
                                                    <p className="text-lg font-bold text-white/30 uppercase leading-none mt-2"> {t.produto || "Mentoria Squad"} • {formatCurrency(t.valor)}</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="mt-auto pt-12 border-t border-white/5">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Sync Engine</p>
                                            <div className="flex gap-1.5">
                                                <div className="h-4 w-1 bg-primary/60 rounded-full" />
                                                <div className="h-6 w-1 bg-primary rounded-full animate-[pulse_1s_infinite_0.1s]" />
                                                <div className="h-3 w-1 bg-primary/40 rounded-full" />
                                                <div className="h-7 w-1 bg-primary rounded-full animate-[pulse_1.2s_infinite]" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-mono text-white/20">RELAY_OK (200)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 1 && (
                        <motion.div
                            key="sales"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.8 }}
                            className="flex-grow flex flex-col gap-12"
                        >
                            <div className="grid grid-cols-2 gap-12 flex-grow mb-12">
                                <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 flex flex-col justify-center">
                                    <p className="text-4xl font-black text-white/40 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                                        <ShoppingCart className="text-primary" size={40} />
                                        Total Pipeline
                                    </p>
                                    <h2 className="text-[12rem] font-black tracking-tighter leading-none">
                                        {formatCurrency(kpis?.receita_total || 0).split(',')[0]}
                                    </h2>
                                    <p className="text-4xl font-bold text-white/20 mt-4 italic uppercase">Potential Projected Volume</p>
                                </div>
                                <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 flex flex-col justify-center">
                                    <p className="text-4xl font-black text-white/40 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                                        <TrendingUp className="text-success" size={40} />
                                        Conversion Target
                                    </p>
                                    <div className="flex items-baseline gap-6">
                                        <h2 className="text-[12rem] font-black tracking-tighter leading-none text-success">
                                            {pct}%
                                        </h2>
                                        <span className="text-4xl font-bold text-white/20">/ MONTH</span>
                                    </div>
                                    <div className="mt-8 h-4 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-success shadow-[0_0_20px_rgba(16,185,129,0.5)]" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 2 && (
                        <motion.div
                            key="finance"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8 }}
                            className="flex-grow flex flex-col gap-12"
                        >
                            <div className="grid grid-cols-3 gap-12 flex-grow mb-12">
                                <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 flex flex-col justify-between">
                                    <p className="text-2xl font-black text-white/40 uppercase tracking-[0.4em]">Settled OpEx</p>
                                    <h3 className="text-7xl font-black text-error">
                                        {formatCurrency(kpis?.despesas_total || 0)}
                                    </h3>
                                    <p className="text-sm font-mono text-white/10">BURN_READY_0x42f</p>
                                </div>
                                <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 flex flex-col justify-between">
                                    <p className="text-2xl font-black text-white/40 uppercase tracking-[0.4em]">Operating Costs</p>
                                    <h3 className="text-7xl font-black text-warning">
                                        {formatCurrency(kpis?.custos_total || 0)}
                                    </h3>
                                    <p className="text-sm font-mono text-white/10">MARGIN_BUFFER_SAFE</p>
                                </div>
                                <div className="bg-white/5 p-12 rounded-[4rem] border border-primary/20 flex flex-col justify-between shadow-[inset_0_0_100px_rgba(0,102,255,0.05)]">
                                    <p className="text-2xl font-black text-primary/80 uppercase tracking-[0.4em]">Net Yield</p>
                                    <h3 className="text-7xl font-black text-white">
                                        {formatCurrency(kpis?.lucro || 0)}
                                    </h3>
                                    <p className="text-sm font-mono text-primary/40 animate-pulse">PROFIT_EXECUTION_STABLE</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Status Bar */}
                <div className="flex justify-between items-center py-4 border-t border-white/5 relative z-10">
                    <p className="text-white/20 font-black tracking-[0.3em] uppercase text-[10px] italic">Antigravity Command Protocol v1.42.0</p>
                    <div className="flex gap-12">
                        <div className="flex items-center gap-4 text-white/30 font-black text-[10px] uppercase tracking-widest">
                            <span className="w-2 h-2 bg-success rounded-full" /> API: STABLE
                        </div>
                        <div className="flex items-center gap-4 text-white/30 font-black text-[10px] uppercase tracking-widest">
                            <span className="w-2 h-2 bg-primary rounded-full" /> DB: PRIMARY
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
