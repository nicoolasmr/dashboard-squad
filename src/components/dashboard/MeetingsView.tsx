"use client";

import React, { useState } from "react";
import { Plus, Search, Calendar, Clock, Video, User, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Meeting } from "@/types/dashboard";
import { formatDateTime, cn } from "@/lib/utils";

export function MeetingsView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const columns: any[] = [
        {
            header: "Data/Hora", accessor: (item: Meeting) => (
                <div className="flex flex-col">
                    <span className="font-bold">{formatDateTime(item.data_hora)}</span>
                    <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                        {item.canal === 'ZOOM' || item.canal === 'MEET' ? <Video size={10} /> : <User size={10} />}
                        {item.canal}
                    </span>
                </div>
            )
        },
        { header: "Título", accessor: "titulo" },
        {
            header: "Cliente", accessor: (item: Meeting) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold">
                        {item.cliente.split(' ')[0][0]}
                    </div>
                    <span>{item.cliente}</span>
                </div>
            )
        },
        { header: "Owner", accessor: "owner" },
        {
            header: "Status", accessor: (item: Meeting) => {
                const variants: Record<string, "success" | "warning" | "error" | "primary" | "muted"> = {
                    'FEITA': 'success',
                    'MARCADA': 'primary',
                    'CANCELADA': 'error',
                    'NO_SHOW': 'warning',
                    'REMARCADA': 'muted'
                };
                return <Badge variant={variants[item.status] || "muted"}>{item.status}</Badge>;
            }
        },
        {
            header: "Ações", accessor: (item: Meeting) => (
                <div className="flex gap-3">
                    <button title="Concluir" onClick={() => toast("Reunião marcada como Feita", "success")} className="text-success hover:scale-110 transition-transform">
                        <CheckCircle2 size={18} />
                    </button>
                    <button title="Ausente" onClick={() => toast("No-show registrado", "warning")} className="text-warning hover:scale-110 transition-transform">
                        <XCircle size={18} />
                    </button>
                    <button title="Remarcar" onClick={() => toast("Interface de remarcar...", "info")} className="text-muted-foreground hover:scale-110 transition-transform">
                        <RotateCcw size={18} />
                    </button>
                </div>
            )
        },
    ];

    // Mock data
    const data: Meeting[] = [
        {
            id: "m1",
            data_hora: "2026-03-03T14:00",
            titulo: "Briefing Projeto X",
            cliente: "Squad Corp",
            owner: "Nicolas Moreira",
            status: "MARCADA",
            canal: "ZOOM",
            notas: "Trazer orçamento"
        },
        {
            id: "m2",
            data_hora: "2026-03-03T16:30",
            titulo: "Apresentação de Resultados",
            cliente: "Tech Solutions",
            owner: "Maria Silva",
            status: "FEITA",
            canal: "MEET",
            notas: "Aprovado sem ressalvas"
        }
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reuniões</h1>
                    <p className="text-muted-foreground mt-1">Acompanhe a agenda do time comercial e suporte.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-success text-white hover:bg-success/90 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-success/20 active:scale-95"
                >
                    <Plus size={20} />
                    Agendar Reunião
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Hoje</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-4xl font-bold">12</h3>
                        <p className="text-sm font-medium text-success">4 já realizadas</p>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Amanhã</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-4xl font-bold">8</h3>
                        <p className="text-sm font-medium text-muted-foreground">Expectativa alta</p>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border shadow-premium flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar size={18} className="text-primary" />
                        Cronograma de Reuniões
                    </h3>
                </div>
                <DataTable columns={columns} data={data} emptyMessage="Sem reuniões para o período." />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Reunião" size="md">
                <form className="flex flex-col gap-4" onSubmit={(e) => {
                    e.preventDefault();
                    toast("Sincronizando com n8n...", "info");
                    setTimeout(() => {
                        toast("Reunião agendada!", "success");
                        setIsModalOpen(false);
                    }, 1000);
                }}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Título da Reunião</label>
                        <input required type="text" placeholder="Ex: Demonstração de Produto" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Cliente</label>
                        <input required type="text" placeholder="Nome da empresa ou pessoa" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Data e Hora</label>
                            <input required type="datetime-local" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Canal</label>
                            <select className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary">
                                <option>ZOOM</option>
                                <option>MEET</option>
                                <option>CALL</option>
                                <option>PRESENCIAL</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Owner (Responsável)</label>
                        <select className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary">
                            <option>Nicolas Moreira</option>
                            <option>Maria Silva</option>
                            <option>João Santos</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Notas (Opcional)</label>
                        <textarea rows={3} placeholder="Instruções ou contexto..." className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary resize-none" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold hover:bg-muted transition-all">Cancelar</button>
                        <button type="submit" className="px-8 py-2.5 bg-success text-white rounded-xl font-bold shadow-lg shadow-success/20 hover:bg-success/90 transition-all">
                            Agendar Agora
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
