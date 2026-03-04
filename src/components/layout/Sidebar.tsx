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
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col py-6 px-4 gap-2 shadow-sm">
            <div className="mb-4 px-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu Principal</h2>
            </div>
            {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            activeTab === tab.id
                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <Icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                );
            })}

            <div className="mt-auto px-4 py-4 bg-muted/50 rounded-2xl border border-border/50">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Plano</p>
                    <p className="text-sm font-semibold">Enterprise Scale</p>
                </div>
            </div>
        </aside>
    );
}
