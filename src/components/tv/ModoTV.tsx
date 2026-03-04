"use client";

import React, { useState, useEffect } from "react";
import { DashboardData } from "@/types/dashboard";
import { KPICard } from "@/components/ui/KPICard";
import { TrendingUp, DollarSign, BarChart3, Clock, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, cn } from "@/lib/utils";

interface ModoTVProps {
    data: DashboardData | null;
    loading: boolean;
    lastSync: Date;
}

export function ModoTV({ data, loading, lastSync }: ModoTVProps) {
    const [activeView, setActiveView] = useState(0);
    const views = ["GERAL", "VENDAS", "METRICAS"];
    const kpis = data?.kpis;

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveView((prev) => (prev + 1) % views.length);
        }, 15000); // Rotate every 15s
        return () => clearInterval(interval);
    }, [views.length]);

    return (
        <div className="fixed inset-0 bg-background z-[200] flex flex-col p-10 gap-10">
            {/* TV Header */}
            <div className="flex justify-between items-center border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">D</div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter uppercase">OPERATIONAL CENTER</h1>
                        <div className="flex gap-4">
                            {views.map((v, i) => (
                                <span key={v} className={cn(
                                    "text-xs font-bold transition-all duration-500",
                                    activeView === i ? "text-primary" : "text-muted-foreground opacity-30"
                                )}>
                                    • {v}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-sm font-bold text-muted-foreground uppercase opacity-50">Local Time</p>
                        <p className="text-2xl font-mono font-bold tracking-widest">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-success font-bold">
                            <RefreshCw size={16} className="animate-spin-slow" />
                            <span className="text-xl">LIVE</span>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Sync: {lastSync.toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeView === 0 && (
                    <motion.div
                        key="geral"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="grid grid-cols-2 gap-10 flex-grow"
                    >
                        <div className="grid grid-cols-1 gap-10">
                            <div className="bg-card p-10 rounded-[40px] border border-border flex flex-col justify-center shadow-2xl">
                                <p className="text-2xl font-bold text-muted-foreground uppercase tracking-widest mb-4">Receita Aprovada</p>
                                <h2 className="text-8xl font-black tracking-tighter text-primary">
                                    {formatCurrency(kpis?.receita_aprovada || 0)}
                                </h2>
                            </div>
                            <div className="bg-card p-10 rounded-[40px] border border-border flex flex-col justify-center shadow-2xl">
                                <p className="text-2xl font-bold text-muted-foreground uppercase tracking-widest mb-4">Meta Diária</p>
                                <div className="flex items-end gap-10">
                                    <h2 className="text-8xl font-black tracking-tighter">84%</h2>
                                    <div className="flex-grow h-6 bg-muted rounded-full overflow-hidden mb-6">
                                        <div className="h-full bg-primary" style={{ width: '84%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card p-10 rounded-[40px] border border-border shadow-2xl">
                            <p className="text-2xl font-bold text-muted-foreground uppercase tracking-widest mb-8">Próximas Reuniões</p>
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex justify-between items-center p-6 bg-muted/30 rounded-3xl">
                                        <div className="flex items-center gap-8">
                                            <span className="text-4xl font-mono font-bold text-primary">1{i}:00</span>
                                            <div>
                                                <p className="text-2xl font-bold italic">Briefing Estratégico {i}</p>
                                                <p className="text-lg text-muted-foreground uppercase font-bold">Nicolas Moreira</p>
                                            </div>
                                        </div>
                                        <Badge className="text-xl px-6 py-2" variant="primary">ZOOM</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Other views would be similar... skipping for MVP scale */}
                {activeView > 0 && (
                    <motion.div
                        key="alt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center flex-grow bg-card rounded-[40px] border border-border"
                    >
                        <div className="text-center italic text-muted-foreground text-4xl">
                            Processando métricas de {views[activeView]}...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-center">
                <p className="text-muted-foreground font-bold tracking-widest uppercase opacity-20 text-xs">ANTIGRAVITY OPERATIONAL SYSTEM v1.0.42</p>
            </div>
        </div>
    );
}
