"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Tv, RefreshCw, PlusCircle, Settings, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

interface NavbarProps {
    activeTab: string;
    onRefresh: () => void;
    onNewSale: () => void;
    onNewExpense: () => void;
    onNewMeeting: () => void;
    onSettings: () => void;
    onConfigGoal?: () => void;
}

export function Navbar({ onRefresh, onNewSale, onNewExpense, onNewMeeting, onSettings, onConfigGoal }: NavbarProps) {
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
        // Use full URL to avoid potential relative path issues on Vercel
        const url = window.location.origin + "/?tv=1";
        window.open(url, "_blank");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6 transition-all duration-300">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                    D
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-base leading-tight">Dashboard</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold hidden sm:block">Vendas & Financeiro</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNewSale}
                        className="h-8 rounded-xl text-primary hover:bg-primary/10 hover:text-primary gap-2"
                    >
                        <PlusCircle size={14} />
                        Nova Venda
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNewExpense}
                        className="h-8 rounded-xl text-error hover:bg-error/10 hover:text-error gap-2"
                    >
                        <PlusCircle size={14} />
                        Despesa
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onNewMeeting}
                        className="h-8 rounded-xl text-success hover:bg-success/10 hover:text-success gap-2"
                    >
                        <PlusCircle size={14} />
                        Reunião
                    </Button>
                    <div className="w-px h-5 bg-border" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onConfigGoal}
                        className="h-8 rounded-xl text-amber-500 hover:bg-amber-500/10 hover:text-amber-500 gap-2"
                    >
                        <Target size={14} />
                        Meta do Mês
                    </Button>
                </div>

                <div className="w-px h-8 bg-border hidden md:block" />

                <div className="flex items-center gap-1">
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={onRefresh} className="rounded-xl text-muted-foreground">
                                    <RefreshCw size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Atualizar Dados</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl text-muted-foreground">
                                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Trocar Tema</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={toggleTVMode} className="rounded-xl text-muted-foreground">
                                    <Tv size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modo TV</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={onSettings} className="rounded-xl ml-2 border-border/60 hover:bg-muted/50">
                                    <Settings size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Configurações</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </nav>
    );
}
