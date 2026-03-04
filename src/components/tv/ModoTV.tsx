"use client";

import React, { useState, useEffect } from "react";
import { DashboardData } from "@/types/dashboard";
import { TrendingUp, DollarSign, BarChart3, Clock, RefreshCw, X, Maximize2, Zap, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
                                <div key={v} className="flex flex-col gap-1">
                                    <span className={cn(
                                        "text-[10px] font-black tracking-[0.2em] transition-all duration-700",
                                        activeView === i ? "text-primary opacity-100" : "text-white opacity-20"
                                    )}>
                                        {v}
                                    </span>
                                    <div className={cn(
                                        "h-0.5 rounded-full transition-all duration-700",
                                        activeView === i ? "bg-primary w-full" : "bg-white/10 w-4"
                                    )} />
                                </div>
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
                                        <h2 className="text-[clamp(4rem,10vw,12rem)] font-black tracking-[-0.06em] leading-none mb-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 truncate">
                                            {formatCurrency(kpis?.receita_aprovada || 0).split(',')[0]}
                                            <span className="text-[0.4em] text-white/20">,{formatCurrency(kpis?.receita_aprovada || 0).split(',')[1]}</span>
                                        </h2>
                                        <div className="flex items-center gap-8">
                                            <Badge className="text-4xl px-10 py-4 rounded-3xl bg-success text-white font-black">
                                                +12.4%
                                            </Badge>
                                            <div className="flex-grow h-4 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '68%' }}
                                                    className="h-full bg-gradient-to-r from-primary to-primary-foreground shadow-[0_0_20px_rgba(0,102,255,0.5)]"
                                                />
                                            </div>
                                            <span className="text-3xl font-black opacity-40">68% OF GOAL</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 flex-grow mb-12">
                                    <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 flex flex-col justify-center">
                                        <p className="text-xl font-bold text-white/30 uppercase tracking-[0.3em] mb-4">Daily Velocity</p>
                                        <div className="flex items-baseline gap-4">
                                            <h3 className="text-8xl font-black tracking-tighter">1,4k</h3>
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
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex gap-8 group">
                                            <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Zap className="text-primary" size={32} />
                                            </div>
                                            <div className="flex flex-col justify-center gap-1">
                                                <p className="text-3xl font-black leading-none uppercase tracking-tighter">New Conversion</p>
                                                <p className="text-lg font-bold text-white/30 uppercase leading-none mt-2"> Mentoria Squad • $1.5k</p>
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

                    {activeView > 0 && (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center flex-grow bg-white/5 rounded-[4rem] border border-white/10 mb-12 border-dashed"
                        >
                            <div className="text-center space-y-8">
                                <div className="w-32 h-32 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto pb-4" />
                                <h3 className="text-6xl font-black italic tracking-tighter opacity-20 uppercase">Decoding {views[activeView]} Data...</h3>
                                <p className="text-white/10 font-mono tracking-widest text-sm uppercase">Accessing secure endpoint: /api/v1/metrics/{views[activeView].toLowerCase().replace(' ', '-')}</p>
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
