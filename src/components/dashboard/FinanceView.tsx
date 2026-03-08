"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, Wallet, Receipt, Calendar, Tag, TrendingUp, X, LayoutGrid, List, Target, ChevronRight, ReceiptText, MoreHorizontal, Loader2 } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals, progressColor } from "@/hooks/useGoals";
import { GanttChart } from "./GanttChart";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types/dashboard";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export function FinanceView() {
    const [activeSubTab, setActiveSubTab] = useState<'DESPESA' | 'CUSTO'>('DESPESA');
    const { data: allData, loading, create, update, remove } = useTransactions();
    const currentMes = new Date().toISOString().slice(0, 7);
    const { goal } = useGoals(currentMes);
    const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Transaction | null>(null);
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        descricao: "", categoria: "", valor: "", responsavel: "Financeiro",
        data: new Date().toISOString().slice(0, 10), status: "PREVISTO" as string,
        recorrencia: "PONTUAL" as string, parcelas: "1", subcategoria: ""
    });

    const columns: any[] = [
        { header: "Data", accessor: (item: Transaction) => formatDate(item.data) },
        {
            header: "Descrição",
            accessor: (item: Transaction) => (
                <span className="font-medium text-foreground">{item.descricao}</span>
            )
        },
        {
            header: "Categoria", accessor: (item: Transaction) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase tracking-tight">{item.categoria}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{item.subcategoria}</span>
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
                const variants: Record<string, "success" | "warning" | "destructive" | "outline"> = {
                    'PAGO': 'success',
                    'PREVISTO': 'warning',
                    'CANCELADO': 'destructive',
                };
                return (
                    <Badge variant={variants[item.status] as any} className="rounded-lg px-2.5 py-0.5 font-bold border-none capitalize">
                        {item.status.toLowerCase()}
                    </Badge>
                );
            }
        },
        {
            header: "Responsável",
            accessor: (item: Transaction) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {item.responsavel.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium">{item.responsavel}</span>
                </div>
            )
        },
        {
            header: "", accessor: (item: Transaction) => (
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedRecord(item);
                }}>
                    <MoreHorizontal size={16} className="text-muted-foreground" />
                </Button>
            )
        },
    ];

    // Filter real data by active tab
    const currentData = allData.filter(item => item.tipo === activeSubTab);

    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

    const filteredData = currentData.filter(item => {
        const matchesSearch = (item.descricao?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (item.categoria?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (item.responsavel?.toLowerCase() || "").includes(search.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        const matchesCategory = categoryFilter === "ALL" || item.categoria === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState<"TABLE" | "GANTT">("TABLE");

    // Map finance to Gantt format (Cash Flow Forecast)
    const ganttData = filteredData.map(f => {
        const dueDate = new Date(f.data);
        // Show as a 1-day point/bar on the timeline
        const duration = 24 * 60 * 60 * 1000;

        const colors: Record<string, string> = {
            'PAGO': '#22c55e',     // green
            'PREVISTO': '#f59e0b', // amber
            'CANCELADO': '#ef4444' // red
        };

        return {
            id: f.id,
            name: f.descricao ?? f.categoria ?? 'Lançamento',
            start: dueDate.getTime(),
            duration: duration,
            color: colors[f.status] || '#3b82f6',
            status: f.status,
            value: formatCurrency(f.valor)
        };
    });

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent italic">Fluxo Financeiro</h1>
                    <p className="text-muted-foreground mt-2 text-base font-medium uppercase tracking-tighter">Gerenciamento de desembolsos e provisões</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsNewRecordOpen(true)} className="rounded-xl px-6 h-12 bg-primary font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform gap-2 border-none">
                        <Plus size={20} />
                        Registrar {activeSubTab === 'DESPESA' ? 'Despesa' : 'Custo'}
                    </Button>
                </div>
            </div>

            {/* Meta Progress Bar (Costs) */}
            {goal && activeSubTab === 'CUSTO' && (goal.meta_lucro ?? 0) > 0 && (() => {
                const custoReal = allData.filter(t => t.tipo === 'CUSTO' && t.status === 'PAGO').reduce((s, t) => s + t.valor, 0);
                const metaCusto = (goal.meta_receita ?? 0) - (goal.meta_lucro ?? 0); // Simplified operational cost ceiling
                if (metaCusto <= 0) return null;
                const pct = Math.min(100, (custoReal / metaCusto) * 100);
                // Inverse color logic for costs: green is low, red is high
                const color = pct > 90 ? "var(--destructive)" : pct > 70 ? "var(--warning)" : "var(--success)";

                return (
                    <div className="bg-card/50 backdrop-blur-sm rounded-[1.5rem] border border-border/40 p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <Target size={16} className="text-primary" />
                                <span>Teto de Custos Operacionais — {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</span>
                            </div>
                            <div className="text-sm font-black" style={{ color }}>
                                {custoReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {metaCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                <span className="ml-2 opacity-70">({pct.toFixed(0)}%)</span>
                            </div>
                        </div>
                        <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                        </div>
                    </div>
                );
            })()}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2rem] border-border/60 shadow-premium overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="p-4 bg-success/10 text-success rounded-[1.25rem] group-hover:bg-success group-hover:text-white transition-all duration-500">
                            <ArrowUpCircle size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">Total Liquidado</p>
                            <p className="text-2xl font-bold text-foreground">
                                {formatCurrency(allData.filter(t => t.status === 'PAGO').reduce((s, t) => s + t.valor, 0))}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-border/60 shadow-premium overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="p-4 bg-warning/10 text-warning rounded-[1.25rem] group-hover:bg-warning group-hover:text-white transition-all duration-500">
                            <ArrowDownCircle size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">Total Previsto</p>
                            <p className="text-2xl font-bold text-foreground">
                                {formatCurrency(allData.filter(t => t.status === 'PREVISTO').reduce((s, t) => s + t.valor, 0))}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-primary/20 bg-primary/5 shadow-premium overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="p-4 bg-primary text-white rounded-[1.25rem] shadow-lg shadow-primary/20">
                            <Wallet size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-primary/70 uppercase tracking-[0.1em] mb-1">Balanço do Mês</p>
                            <p className="text-2xl font-bold text-primary">
                                {formatCurrency(
                                    allData.filter(t => t.tipo === 'RECEITA' && t.status === 'APROVADO').reduce((s, t) => s + t.valor, 0) -
                                    allData.filter(t => t.tipo !== 'RECEITA' && (t.status === 'PAGO' || t.status === 'PREVISTO')).reduce((s, t) => s + t.valor, 0)
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table section */}
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-border/60 shadow-premium flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as any)} className="w-full sm:w-auto">
                        <TabsList className="h-12 p-1 bg-muted/40 rounded-xl border border-border/40">
                            <TabsTrigger value="DESPESA" className="rounded-lg font-bold px-8 data-[state=active]:bg-card data-[state=active]:shadow-sm">Despesas</TabsTrigger>
                            <TabsTrigger value="CUSTO" className="rounded-lg font-bold px-8 data-[state=active]:bg-card data-[state=active]:shadow-sm">Custos</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto flex-1">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                            <Input
                                placeholder="Buscar lançamento..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 pl-12 bg-muted/30 border-border/50 rounded-xl"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex bg-muted/20 p-1 rounded-2xl border border-border/50">
                                <Button
                                    variant={viewMode === "TABLE" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-xl h-12 px-4 shadow-sm"
                                    onClick={() => setViewMode("TABLE")}
                                >
                                    <List size={18} className="mr-2" />
                                    Lista
                                </Button>
                                <Button
                                    variant={viewMode === "GANTT" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-xl h-12 px-4 shadow-sm"
                                    onClick={() => setViewMode("GANTT")}
                                >
                                    <LayoutGrid size={18} className="mr-2" />
                                    Gantt
                                </Button>
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-12 w-[140px] rounded-xl border-border/60 bg-muted/20 font-bold text-[10px] uppercase tracking-wider">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos Status</SelectItem>
                                    <SelectItem value="PAGO">Pago</SelectItem>
                                    <SelectItem value="PREVISTO">Previsto</SelectItem>
                                    <SelectItem value="ATRASADO">Atrasado</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-12 w-[150px] rounded-xl border-border/60 bg-muted/20 font-bold text-[10px] uppercase tracking-wider">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todas Categorias</SelectItem>
                                    <SelectItem value="Software">Software</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Equipe">Equipe</SelectItem>
                                    <SelectItem value="Operação">Operação</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                className="h-12 px-5 rounded-xl border-border/60 hover:bg-muted font-bold text-xs"
                                onClick={() => {
                                    setStatusFilter("ALL");
                                    setCategoryFilter("ALL");
                                    setSearch("");
                                    toast.success("Filtros limpos!");
                                }}
                                title="Limpar Filtros"
                            >
                                <Filter size={16} className="mr-2" />
                                Limpar
                            </Button>
                        </div>
                    </div>
                </div>

                {viewMode === "TABLE" ? (
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        emptyMessage="Nenhum registro encontrado."
                        onRowClick={(item) => setSelectedRecord(item)}
                    />
                ) : (
                    <div className="bg-card/30 rounded-[2rem] border border-border/40 p-6">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <h3 className="text-lg font-bold">Fluxo de Caixa (Forecast)</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Vencimentos próximos</p>
                        </div>
                        <GanttChart data={ganttData} type="FINANCE" height={360} />
                    </div>
                )}
            </div>

            {/* Registration Modal */}
            <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] border-border/60 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Registrar {activeSubTab === 'DESPESA' ? 'Despesa' : 'Custo'}</DialogTitle>
                        <DialogDescription>
                            Insira os detalhes do lançamento financeiro para processamento.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 pointer-events-auto">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="desc" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Descrição do Gasto</Label>
                            <Input
                                id="desc"
                                placeholder="Ex: Upgrade Servidores AWS"
                                value={form.descricao}
                                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                                className="h-12 rounded-xl bg-muted/30 border-border/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Categoria</Label>
                            <Select value={form.categoria} onValueChange={v => setForm(f => ({ ...f, categoria: v }))}>
                                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40 font-bold uppercase text-[10px]">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Operação">Operação</SelectItem>
                                    <SelectItem value="Pessoal">Pessoal</SelectItem>
                                    <SelectItem value="Impostos">Impostos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="val" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Valor (R$)</Label>
                            <Input
                                id="val"
                                type="text"
                                placeholder="0,00"
                                value={form.valor}
                                onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                                className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sub" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Subcategoria</Label>
                            <Input
                                id="sub"
                                placeholder="Ex: Assinatura, Imposto..."
                                value={form.subcategoria}
                                onChange={e => setForm(f => ({ ...f, subcategoria: e.target.value }))}
                                className="h-12 rounded-xl bg-muted/30 border-border/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stat" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Status do Gasto</Label>
                            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40 font-bold uppercase text-[10px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PREVISTO">Previsto</SelectItem>
                                    <SelectItem value="PAGO">Pago</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parc" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Nº de Repetições</Label>
                            <Input
                                id="parc"
                                type="number"
                                placeholder="1"
                                value={form.parcelas}
                                onChange={e => setForm(f => ({ ...f, parcelas: e.target.value }))}
                                className="h-12 rounded-xl bg-muted/30 border-border/40"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setIsNewRecordOpen(false)} className="rounded-xl font-bold h-12">
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            className="rounded-xl font-bold h-12 px-8 shadow-lg shadow-error/20"
                            disabled={saving || !form.descricao || !form.valor}
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    const parsedValor = parseFloat(form.valor.replace(',', '.'));
                                    if (isNaN(parsedValor)) throw new Error("Valor inválido.");

                                    await create({
                                        tipo: activeSubTab,
                                        status: form.status as any,
                                        data: form.data,
                                        valor: parsedValor,
                                        categoria: form.categoria || "Geral",
                                        subcategoria: form.subcategoria || "Outros",
                                        responsavel: form.responsavel,
                                        descricao: form.descricao,
                                        origem: "MANUAL",
                                        recorrencia: form.recorrencia as any,
                                        parcelas: parseInt(form.parcelas) || 1
                                    });

                                    // Explicit refresh to ensure UI updates
                                    // However, useTransactions already has a real-time listener.
                                    // If it's not working, it might be due to session/filters.
                                    toast.success("Lançamento registrado com sucesso!");
                                    setIsNewRecordOpen(false);
                                    setForm({
                                        descricao: "", categoria: "", valor: "", responsavel: "Financeiro",
                                        data: new Date().toISOString().slice(0, 10), status: "PREVISTO",
                                        recorrencia: "PONTUAL", parcelas: "1", subcategoria: ""
                                    });
                                } catch (e: any) {
                                    toast.error(`Erro: ${e.message}`);
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                            Salvar Transação
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Details & Edit Modal */}
            <Dialog open={!!selectedRecord} onOpenChange={(open) => {
                if (!open) {
                    setSelectedRecord(null);
                    setIsEditing(false);
                }
            }}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border-border/60 p-0 overflow-hidden shadow-2xl">
                    {selectedRecord && (
                        <>
                            <div className="bg-error/5 p-8 pb-12 relative border-b border-error/10">
                                <div className="absolute top-8 right-8">
                                    <Badge variant={selectedRecord.status === 'PAGO' ? 'success' : 'warning'} className="rounded-xl px-4 py-1.5 font-bold uppercase tracking-wider border-none text-xs">
                                        {selectedRecord.status}
                                    </Badge>
                                </div>
                                <div className="w-16 h-16 bg-error rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-error/20">
                                    <Receipt size={32} />
                                </div>
                                {isEditing ? (
                                    <Input
                                        value={selectedRecord.descricao}
                                        onChange={e => setSelectedRecord(r => r ? { ...r, descricao: e.target.value } : null)}
                                        className="text-2xl font-bold bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-1 italic p-0"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-foreground leading-tight italic">"{selectedRecord.descricao}"</h2>
                                )}
                                <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <Wallet size={14} /> Transação ID: {selectedRecord.id}
                                </p>
                            </div>

                            <div className="p-8 bg-card relative z-10 space-y-8 rounded-t-[2.5rem] -mt-6 shadow-2xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 line-clamp-1">
                                            <Tag size={12} className="inline mr-1" /> Categoria
                                        </p>
                                        {isEditing ? (
                                            <Select
                                                value={selectedRecord.categoria}
                                                onValueChange={v => setSelectedRecord(r => r ? { ...r, categoria: v } : null)}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl bg-muted/40 border-none font-bold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TI">TI</SelectItem>
                                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                                    <SelectItem value="Operação">Operação</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <>
                                                <p className="font-bold text-lg">{selectedRecord.categoria}</p>
                                                <p className="text-xs text-muted-foreground italic">{selectedRecord.subcategoria}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 justify-end flex items-center">
                                            <Wallet size={12} className="inline mr-1" /> Valor Total
                                        </p>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={selectedRecord.valor}
                                                onChange={e => setSelectedRecord(r => r ? { ...r, valor: parseFloat(e.target.value) || 0 } : null)}
                                                className="text-right font-bold text-2xl text-error bg-transparent border-none p-0 h-auto"
                                            />
                                        ) : (
                                            <p className="font-bold text-3xl text-error">{formatCurrency(selectedRecord.valor)}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">
                                            <Calendar size={12} className="inline mr-1" /> {isEditing ? "Alterar Data" : "Data do Lançamento"}
                                        </p>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={selectedRecord.data}
                                                onChange={e => setSelectedRecord(r => r ? { ...r, data: e.target.value } : null)}
                                                className="h-10 rounded-xl bg-muted/40 border-none"
                                            />
                                        ) : (
                                            <p className="font-medium">{formatDate(selectedRecord.data)}</p>
                                        )}
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 justify-end flex items-center">
                                        <TrendingUp size={12} className="inline mr-1" /> Recorrência / Origem
                                    </p>
                                    <div className="flex flex-col items-end gap-1">
                                        {isEditing ? (
                                            <div className="flex flex-col gap-2">
                                                <Select
                                                    value={selectedRecord.recorrencia || "PONTUAL"}
                                                    onValueChange={v => setSelectedRecord(r => r ? { ...r, recorrencia: v as any } : null)}
                                                >
                                                    <SelectTrigger className="h-9 w-32 rounded-lg bg-muted/40 border-none font-bold text-[10px] uppercase">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PONTUAL">Pontual</SelectItem>
                                                        <SelectItem value="RECORRENTE">Recorrente</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    value={selectedRecord.origem}
                                                    onValueChange={v => setSelectedRecord(r => r ? { ...r, origem: v as any } : null)}
                                                >
                                                    <SelectTrigger className="h-9 w-32 rounded-lg bg-muted/40 border-none font-bold text-[10px] uppercase">
                                                        <SelectValue placeholder="Origem" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MANUAL">Manual</SelectItem>
                                                        <SelectItem value="ASAAS">Asaas</SelectItem>
                                                        <SelectItem value="KIWIFY">Kiwify</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="font-medium text-foreground">
                                                    {selectedRecord.recorrencia === 'RECORRENTE' ? `${selectedRecord.parcelas}x ${selectedRecord.recorrencia_periodo}` : "Pontual"}
                                                </p>
                                                <p className="font-medium text-[10px] opacity-70 italic uppercase tracking-widest">{selectedRecord.origem}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                className="flex-1 h-12 rounded-xl font-bold"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="flex-1 h-12 rounded-xl font-bold px-8 shadow-lg shadow-error/20"
                                                disabled={saving}
                                                onClick={async () => {
                                                    setSaving(true);
                                                    try {
                                                        await update(selectedRecord.id, {
                                                            descricao: selectedRecord.descricao,
                                                            categoria: selectedRecord.categoria,
                                                            valor: selectedRecord.valor,
                                                            data: selectedRecord.data,
                                                            recorrencia: selectedRecord.recorrencia,
                                                            origem: selectedRecord.origem
                                                        });
                                                        toast.success("Alterações salvas com sucesso!");
                                                        setIsEditing(false);
                                                    } catch (e: any) {
                                                        toast.error(`Erro ao salvar: ${e.message}`);
                                                    } finally {
                                                        setSaving(false);
                                                    }
                                                }}
                                            >
                                                {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                                                Salvar Alterações
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-12 rounded-xl font-bold border-border/60"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Editar Dados
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="w-12 h-12 rounded-xl font-bold p-0 flex items-center justify-center border-border/60"
                                                disabled={saving}
                                                onClick={async () => {
                                                    if (confirm("Tem certeza que deseja excluir?")) {
                                                        setSaving(true);
                                                        try {
                                                            await remove(selectedRecord.id);
                                                            toast.error("Gasto excluído permanentemente.");
                                                            setSelectedRecord(null);
                                                        } catch (e: any) {
                                                            toast.error(`Erro ao excluir: ${e.message}`);
                                                        } finally {
                                                            setSaving(false);
                                                        }
                                                    }
                                                }}
                                                title="Excluir Gasto"
                                            >
                                                <X size={20} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
