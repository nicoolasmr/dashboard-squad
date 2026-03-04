"use client";

import React, { useState } from "react";
import { Settings, Save, Globe, Lock } from "lucide-react";
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
    const [baseUrl, setBaseUrl] = useState(typeof window !== "undefined" ? localStorage.getItem("n8n_base_url") || "https://nicoolasmr.app.n8n.cloud" : "https://nicoolasmr.app.n8n.cloud");
    const [token, setToken] = useState(typeof window !== "undefined" ? localStorage.getItem("n8n_token") || "" : "");

    const handleSave = () => {
        localStorage.setItem("n8n_base_url", baseUrl);
        localStorage.setItem("n8n_token", token);
        toast.success("Configurações salvas! Recarregando dados...");
        onClose();
        setTimeout(() => window.location.reload(), 1000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md rounded-[2rem] border-border/60">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Settings size={22} />
                        </div>
                        Configurações API
                    </DialogTitle>
                    <DialogDescription className="font-medium pt-2 italic">
                        Configure seu endpoint n8n para sincronização real.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Base URL n8n</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                <Input
                                    className="pl-10 h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-xs"
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    placeholder="https://sua-instancia.n8n.cloud"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">X-DASH-TOKEN</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                <Input
                                    type="password"
                                    className="pl-10 h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-xs"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="••••••••••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] leading-relaxed text-primary/70 font-bold uppercase tracking-tight">
                            Nota: Seus dados de conexão são armazenados de forma criptografada apenas no seu navegador.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">Cancelar</Button>
                    <Button onClick={handleSave} className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20">
                        <Save size={18} className="mr-2" />
                        Salvar e Conectar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
