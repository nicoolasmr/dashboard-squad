"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Tv, RefreshCw, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
    activeTab: string;
    onRefresh: () => void;
    onNewSale: () => void;
    onNewExpense: () => void;
    onNewMeeting: () => void;
    onSettings: () => void;
}

export function Navbar({ onRefresh, onNewSale, onNewExpense, onNewMeeting, onSettings }: NavbarProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const toggleTVMode = () => {
        const url = new URL(window.location.href);
        if (url.searchParams.get("tv") === "1") {
            url.searchParams.delete("tv");
        } else {
            url.searchParams.set("tv", "1");
        }
        window.location.href = url.toString();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    D
                </div>
                <span className="font-bold text-lg hidden sm:block">
                    Dashboard <span className="text-muted-foreground font-normal">— Vendas & Financeiro</span>
                </span>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 mr-4 pr-4 border-r border-border">
                    <button
                        onClick={onNewSale}
                        className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                    >
                        <PlusCircle size={16} />
                        <span>Nova Venda</span>
                    </button>
                    <button
                        onClick={onNewExpense}
                        className="flex items-center gap-2 bg-error/10 text-error hover:bg-error/20 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                    >
                        <PlusCircle size={16} />
                        <span>Despesa</span>
                    </button>
                    <button
                        onClick={onNewMeeting}
                        className="flex items-center gap-2 bg-success/10 text-success hover:bg-success/20 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                    >
                        <PlusCircle size={16} />
                        <span>Reunião</span>
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onRefresh}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-lg"
                        title="Atualizar"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-lg"
                        title="Trocar Tema"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={toggleTVMode}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-lg"
                        title="Modo TV"
                    >
                        <Tv size={20} />
                    </button>
                    <button
                        onClick={onSettings}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-lg"
                        title="Configurações"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
