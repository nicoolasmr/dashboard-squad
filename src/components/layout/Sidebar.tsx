"use client";

import React from "react";
import {
    LayoutDashboard,
    TrendingUp,
    Wallet,
    Users,
    UploadCloud
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const TABS = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "sales", label: "Vendas", icon: TrendingUp },
    { id: "finance", label: "Despesas & Custos", icon: Wallet },
    { id: "meetings", label: "Reuniões", icon: Users },
    { id: "import", label: "Importar Planilhas", icon: UploadCloud },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card/50 backdrop-blur-sm border-r border-border hidden lg:flex flex-col py-8 px-4 gap-1.5 transition-all duration-300">
            <div className="mb-6 px-3">
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-70">Navegação</h2>
            </div>

            <nav className="flex flex-col gap-1.5 flex-1">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 translate-x-1"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            )}
                        >
                            <Icon size={18} className={cn(
                                "transition-transform duration-300",
                                isActive ? "scale-110" : "group-hover:scale-110"
                            )} />
                            <span>{tab.label}</span>

                            {isActive && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto p-5 bg-gradient-to-br from-muted/40 to-muted/10 rounded-[2rem] border border-border/40">
                <div className="flex flex-col gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success mb-2">
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    </div>
                    <p className="text-[10px] uppercase font-heavy text-muted-foreground/50 tracking-widest">Status da Conta</p>
                    <p className="text-xs font-bold flex items-center gap-2">
                        Enterprise Active
                    </p>
                </div>
            </div>
        </aside>
    );
}
