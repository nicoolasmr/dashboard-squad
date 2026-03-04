"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Search, LayoutGrid, AlertCircle, Database, RefreshCw, Layers, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ZeroStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: LucideIcon;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
}

export function ZeroState({
    title,
    description,
    actionLabel,
    onAction,
    icon: Icon = Database,
    secondaryActionLabel,
    onSecondaryAction
}: ZeroStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <div className="relative mb-8">
                <div className="w-32 h-32 bg-primary/5 rounded-[3rem] border border-primary/10 flex items-center justify-center text-primary/40 relative z-10">
                    <Icon size={48} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-xl border border-border/50 z-20">
                    <Layers size={20} />
                </div>
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-20 -z-10 animate-pulse" />
            </div>

            <h3 className="text-3xl font-black tracking-tight text-foreground mb-4 leading-tight">{title}</h3>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium mb-10 leading-relaxed italic">
                "{description}"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {actionLabel && (
                    <Button
                        onClick={onAction}
                        className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"
                    >
                        <RefreshCw size={22} className="mr-3" />
                        {actionLabel}
                    </Button>
                )}
                {secondaryActionLabel && (
                    <Button
                        variant="outline"
                        onClick={onSecondaryAction}
                        className="h-14 px-10 rounded-2xl font-bold text-lg border-border/60 hover:bg-muted"
                    >
                        {secondaryActionLabel}
                    </Button>
                )}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <Card className="rounded-3xl border-border/40 bg-card/30 backdrop-blur-sm">
                    <CardContent className="p-6 text-left space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center mb-3">
                            <PlusCircle size={18} />
                        </div>
                        <p className="text-sm font-black text-foreground">Conexão API</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Conecte sua conta n8n via Webhook para receber dados instantâneos.</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-border/40 bg-card/30 backdrop-blur-sm">
                    <CardContent className="p-6 text-left space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                            <Search size={18} />
                        </div>
                        <p className="text-sm font-black text-foreground">Escaneamento</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Sincronize pedidos da Hotmart, Kiwify e Stripe em uma única tela.</p>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-border/40 bg-card/30 backdrop-blur-sm">
                    <CardContent className="p-6 text-left space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center mb-3">
                            <AlertCircle size={18} />
                        </div>
                        <p className="text-sm font-black text-foreground">Modo Seguro</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Seus dados são processados localmente e nunca armazenados.</p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
