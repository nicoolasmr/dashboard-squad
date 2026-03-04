"use client";

import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Transaction } from "@/types/dashboard";
import { formatCurrency, formatDate } from "@/lib/utils";

export function SalesView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { toast } = useToast();

    const columns: any[] = [
        { header: "Data", accessor: (item: Transaction) => formatDate(item.data) },
        {
            header: "Cliente", accessor: (item: Transaction) => (
                <div>
                    <p className="font-bold">{item.nome || "Cliente Desconhecido"}</p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                </div>
            )
        },
        { header: "Produto", accessor: "produto" },
        { header: "Valor", accessor: (item: Transaction) => formatCurrency(item.valor) },
        {
            header: "Status", accessor: (item: Transaction) => {
                const variants: Record<string, "success" | "warning" | "error" | "primary" | "muted"> = {
                    'APROVADO': 'success',
                    'PENDENTE': 'warning',
                    'CANCELADO': 'error',
                    'REEMBOLSADO': 'muted'
                };
                return <Badge variant={variants[item.status] || "muted"}>{item.status}</Badge>;
            }
        },
        { header: "Origem", accessor: "origem" },
        {
            header: "Ações", accessor: (item: Transaction) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => toast(`Venda ${item.id} marcada como Aprovada`, "success")}
                        className="text-xs font-bold text-success hover:underline"
                    >
                        Aprovar
                    </button>
                    <button
                        onClick={() => toast(`Venda ${item.id} marcada como Reembolsada`, "info")}
                        className="text-xs font-bold text-muted-foreground hover:underline"
                    >
                        Reembolsar
                    </button>
                </div>
            )
        },
    ];

    // Mock data
    const data: Transaction[] = [
        {
            id: "1",
            data: "2026-03-03",
            tipo: "RECEITA",
            status: "APROVADO",
            valor: 1497.00,
            categoria: "Venda",
            subcategoria: "Produto 1",
            origem: "KIWIFY",
            produto: "Mentoria Squad",
            nome: "Nicolas Moreira",
            email: "nicolas@exemplo.com",
            responsavel: "Time Vendas",
            descricao: "Venda direta via checkout"
        },
        {
            id: "2",
            data: "2026-03-02",
            tipo: "RECEITA",
            status: "PENDENTE",
            valor: 497.00,
            categoria: "Venda",
            subcategoria: "E-book",
            origem: "HOTMART",
            produto: "Closing Kit",
            nome: "Maria Silva",
            email: "maria@exemplo.com",
            responsavel: "Time Vendas",
            descricao: "Aguardando boleto"
        }
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
                    <p className="text-muted-foreground mt-1">Gerencie suas receitas e transações de vendas.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Plus size={20} />
                    Nova Venda
                </button>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border shadow-premium flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cliente, produto ou email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-muted/50 border border-border rounded-2xl hover:bg-muted font-medium transition-all">
                        <Filter size={18} />
                        Filtros
                    </button>
                </div>

                <DataTable columns={columns} data={data} emptyMessage="Nenhuma venda encontrada." />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nova Venda" size="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Nome do Cliente</label>
                        <input type="text" placeholder="Nome completo" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">E-mail</label>
                        <input type="email" placeholder="email@exemplo.com" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Produto</label>
                        <input type="text" placeholder="Nome do produto" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Valor (R$)</label>
                        <input type="number" placeholder="0,00" step="0.01" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Data</label>
                        <input type="date" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Status</label>
                        <select className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary">
                            <option>APROVADO</option>
                            <option>PENDENTE</option>
                        </select>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold hover:bg-muted transition-all">Cancelar</button>
                    <button
                        onClick={() => {
                            toast("Gravando venda no n8n...", "info");
                            setTimeout(() => {
                                toast("Venda registrada com sucesso!", "success");
                                setIsModalOpen(false);
                            }, 1000);
                        }}
                        className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                        Salvar Venda
                    </button>
                </div>
            </Modal>
        </div>
    );
}
