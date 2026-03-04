"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Settings, Save, Globe, Lock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ConnectionSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ConnectionSettings({ isOpen, onClose }: ConnectionSettingsProps) {
    const [baseUrl, setBaseUrl] = useState(localStorage.getItem("n8n_base_url") || "https://nicoolasmr.app.n8n.cloud");
    const [token, setToken] = useState(localStorage.getItem("n8n_token") || "");
    const { toast } = useToast();

    const handleSave = () => {
        localStorage.setItem("n8n_base_url", baseUrl);
        localStorage.setItem("n8n_token", token);
        toast("Configurações salvas! Recarregando dados...", "success");
        onClose();
        setTimeout(() => window.location.reload(), 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configurações de Conexão (n8n)" size="md">
            <div className="space-y-6">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4">
                    <Settings size={24} className="text-primary mt-1" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Configure o endpoint do seu n8n Cloud e o Token de segurança (X-DASH-TOKEN) para sincronizar os dados em tempo real.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1 flex items-center gap-1.5">
                            <Globe size={12} />
                            Base URL n8n
                        </label>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://sua-instancia.n8n.cloud"
                            className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1 flex items-center gap-1.5">
                            <Lock size={12} />
                            X-DASH-TOKEN
                        </label>
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="••••••••••••••••"
                            className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold hover:bg-muted transition-all text-sm">Cancelar</button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 text-sm"
                    >
                        <Save size={18} />
                        Salvar e Conectar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
