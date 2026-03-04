"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Transaction } from "@/types/dashboard";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export function FinanceView() {
    const [activeSubTab, setActiveSubTab] = useState<'DESPESA' | 'CUSTO'>('DESPESA');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const columns: any[] = [
        { header: "Data", accessor: (item: Transaction) => formatDate(item.data) },
        { header: "Descrição", accessor: "descricao" },
        {
            header: "Categoria", accessor: (item: Transaction) => (
                <div className="flex flex-col">
                    <span className="font-medium text-xs">{item.categoria}</span>
                    <span className="text-[10px] text-muted-foreground">{item.subcategoria}</span>
                </div>
            )
        },
        {
            header: "Valor", accessor: (item: Transaction) => (
                <span className="font-bold text-error">
                    {formatCurrency(item.valor)}
                </span>
            )
        },
        {
            header: "Status", accessor: (item: Transaction) => {
                const variants: Record<string, "success" | "warning" | "error" | "primary" | "muted"> = {
                    'PAGO': 'success',
                    'PREVISTO': 'warning',
                    'CANCELADO': 'error',
                };
                return <Badge variant={variants[item.status] || "muted"}>{item.status}</Badge>;
            }
        },
        { header: "Responsável", accessor: "responsavel" },
    ];

    // Mock data
    const data: Transaction[] = [
        {
            id: "3",
            data: "2026-03-01",
            tipo: activeSubTab,
            status: "PAGO",
            valor: 2450.00,
            categoria: "Infraestrutura",
            subcategoria: "Hospedagem",
            origem: "MANUAL",
            responsavel: "TI",
            descricao: "Pagamento AWS mensal"
        },
        {
            id: "4",
            data: "2026-03-10",
            tipo: activeSubTab,
            status: "PREVISTO",
            valor: 12000.00,
            categoria: "Operação",
            subcategoria: "Folha",
            origem: "PLANILHA",
            responsavel: "Financeiro",
            descricao: "Provisão Salários Squad"
        }
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Despesas & Custos</h1>
                    <p className="text-muted-foreground mt-1">Gerencie as saídas financeiras e o fluxo de caixa.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-error text-white hover:bg-error/90 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-error/20 active:scale-95"
                >
                    <Plus size={20} />
                    {activeSubTab === 'DESPESA' ? 'Nova Despesa' : 'Novo Custo'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-success/10 text-success rounded-xl">
                        <ArrowUpCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Total Pago</p>
                        <p className="text-xl font-bold text-success">{formatCurrency(2450)}</p>
                    </div>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-warning/10 text-warning rounded-xl">
                        <ArrowDownCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Total Previsto</p>
                        <p className="text-xl font-bold text-warning">{formatCurrency(12000)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-3xl border border-border shadow-premium flex flex-col gap-6">
                <div className="flex p-1 bg-muted/50 rounded-2xl w-fit self-center sm:self-start">
                    <button
                        onClick={() => setActiveSubTab('DESPESA')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                            activeSubTab === 'DESPESA' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Despesas
                    </button>
                    <button
                        onClick={() => setActiveSubTab('CUSTO')}
                        className={cn(
                            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                            activeSubTab === 'CUSTO' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Custos
                    </button>
                </div>

                <DataTable columns={columns} data={data} emptyMessage="Nenhum registro encontrado." />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Registrar ${activeSubTab === 'DESPESA' ? 'Despesa' : 'Custo'}`} size="lg">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
                    e.preventDefault();
                    toast("Gravando no n8n...", "info");
                    setTimeout(() => {
                        toast("Registro salvo com sucesso!", "success");
                        setIsModalOpen(false);
                    }, 1000);
                }}>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Descrição</label>
                        <input required type="text" placeholder="Ex: Assinatura Software, Aluguel..." className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Categoria</label>
                        <select className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary">
                            <option>Infraestrutura</option>
                            <option>Marketing</option>
                            <option>Operação</option>
                            <option>Pessoal</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Valor (R$)</label>
                        <input required type="number" placeholder="0,00" step="0.01" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Data</label>
                        <input required type="date" className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Status</label>
                        <select className="px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:outline-none focus:border-primary">
                            <option>PAGO</option>
                            <option>PREVISTO</option>
                        </select>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 md:col-span-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold hover:bg-muted transition-all">Cancelar</button>
                        <button type="submit" className="px-8 py-2.5 bg-error text-white rounded-xl font-bold shadow-lg shadow-error/20 hover:bg-error/90 transition-all">
                            Salvar Registro
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
