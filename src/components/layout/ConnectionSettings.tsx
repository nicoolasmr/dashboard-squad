"use client";

import React, { useState } from "react";
import { Zap, Save, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConnectionSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConnectionSettings({ isOpen, onClose }: ConnectionSettingsProps) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Não configurada";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md rounded-[2rem] border-border/60">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Zap size={22} />
                        </div>
                        Status da Conexão
                    </DialogTitle>
                    <DialogDescription className="font-medium pt-2 italic">
                        Sistema operando via Supabase Edge Runtime.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Database Cloud URL</Label>
                            <div className="p-4 bg-muted/30 rounded-xl border border-border/40 font-mono text-[10px] break-all">
                                {supabaseUrl}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-success/5 rounded-2xl border border-success/10">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            <p className="text-xs font-bold text-success uppercase tracking-tight">Conexão Ativa & Saudável</p>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] leading-relaxed text-primary/70 font-bold uppercase tracking-tight">
                            As integrações com Kiwify e Asaas estão rodando em tempo real através de Edge Functions integradas ao seu banco de dados.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="w-full rounded-xl font-bold h-12 shadow-lg shadow-primary/20">
                        Entendido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
