"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, User, Mail, CreditCard, Calendar, Tag, ExternalLink, LayoutGrid, List, Loader2, Target } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals, goalProgress, progressColor } from "@/hooks/useGoals";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Transaction } from "@/types/dashboard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export function SalesView() {
    const currentMes = new Date().toISOString().slice(0, 7);
    const { data, loading, create } = useTransactions("RECEITA");
    const { goal } = useGoals(currentMes);
    const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Transaction | null>(null);
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);

    // Controlled form state
    const [form, setForm] = useState({
        nome: "", email: "", produto: "", valor: "", origem: "MANUAL" as string, data: new Date().toISOString().slice(0, 10)
    });

    const columns: any[] = [
        { header: "Data", accessor: (item: Transaction) => formatDate(item.data) },
        {
            header: "Cliente", accessor: (item: Transaction) => (
                <div className="flex flex-col">
                    <p className="font-bold text-foreground">{item.nome || "Cliente Desconhecido"}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.email}</p>
                </div>
            )
        },
        { header: "Produto", accessor: "produto" },
        {
            header: "Valor",
            accessor: (item: Transaction) => (
                <span className="font-bold text-foreground">
                    {formatCurrency(item.valor)}
                </span>
            )
        },
        {
            header: "Status", accessor: (item: Transaction) => {
                const variants: Record<string, "success" | "warning" | "destructive" | "default" | "secondary" | "outline"> = {
                    'APROVADO': 'success',
                    'PENDENTE': 'warning',
                    'CANCELADO': 'destructive',
                    'REEMBOLSADO': 'outline'
                };
                return (
                    <Badge variant={variants[item.status] as any} className="rounded-lg px-2.5 py-0.5 font-bold border-none capitalize">
                        {item.status.toLowerCase()}
                    </Badge>
                );
            }
        },
        {
            header: "Origem",
            accessor: (item: Transaction) => (
                <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-bold">
                    {item.origem}
                </Badge>
            )
        },
        {
            header: "", accessor: (item: Transaction) => (
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedSale(item);
                }}>
                    <MoreHorizontal size={16} className="text-muted-foreground" />
                </Button>
            )
        },
    ];

    // Filters applied to real data
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [originFilter, setOriginFilter] = useState<string>("ALL");

    const filteredData = data.filter(item => {
        const matchesSearch = (item.nome?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (item.produto?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (item.email?.toLowerCase() || "").includes(search.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        const matchesOrigin = originFilter === "ALL" || item.origem === originFilter;

        return matchesSearch && matchesStatus && matchesOrigin;
    });

    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState<"TABLE" | "GANTT">("TABLE");

    // Map sales to Gantt format (Lead -> Closing Cycle)
    const ganttData = filteredData.map(s => {
        const closingDate = new Date(s.data);
        // Simulate a 3-day closing cycle
        const startDate = new Date(closingDate.getTime() - (3 * 24 * 60 * 60 * 1000));
        const duration = closingDate.getTime() - startDate.getTime();

        const colors: Record<string, string> = {
            'APROVADO': '#22c55e',   // green
            'PENDENTE': '#f59e0b',   // amber
            'CANCELADO': '#ef4444',  // red
            'REEMBOLSADO': '#94a3b8' // gray
        };

        return {
            id: s.id,
            name: s.nome || "Cliente",
            start: startDate.getTime(),
            duration: duration,
            color: colors[s.status] || '#3b82f6',
            status: s.status,
            value: formatCurrency(s.valor)
        };
    });

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Vendas</h1>
                    <p className="text-muted-foreground mt-2 text-sm font-medium">
                        {loading ? "Carregando..." : `${data.length} registros · Supabase`}
                    </p>
                </div>
                <Button
                    onClick={() => setIsNewSaleOpen(true)}
                    className="h-12 px-8 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus size={20} className="mr-2" />
                    Registrar Venda
                </Button>
            </div>

            {/* Meta Progress Bar */}
            {goal && (goal.meta_receita ?? 0) > 0 && (() => {
                const receitaReal = data.filter(t => t.status === 'APROVADO').reduce((s, t) => s + t.valor, 0);
                const metaReceita = goal.meta_receita ?? 0;
                const pct = Math.min(100, (receitaReal / metaReceita) * 100);
                const color = progressColor(pct);
                return (
                    <div className="bg-card/50 backdrop-blur-sm rounded-[1.5rem] border border-border/40 p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <Target size={16} className="text-amber-500" />
                                <span>Meta de Receita — {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</span>
                            </div>
                            <div className="text-sm font-black" style={{ color }}>
                                {receitaReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {metaReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
            {/* Table section */}
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-border/60 shadow-premium flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <Input
                            placeholder="Buscar cliente, produto ou email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-14 pl-12 pr-4 bg-muted/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-base"
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
                            <SelectTrigger className="h-14 w-[160px] rounded-2xl border-border/60 bg-muted/30 font-bold text-xs uppercase tracking-wider">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos Status</SelectItem>
                                <SelectItem value="APROVADO">Aprovado</SelectItem>
                                <SelectItem value="PENDENTE">Pendente</SelectItem>
                                <SelectItem value="RECUSADO">Recusado</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={originFilter} onValueChange={setOriginFilter}>
                            <SelectTrigger className="h-14 w-[160px] rounded-2xl border-border/60 bg-muted/30 font-bold text-xs uppercase tracking-wider">
                                <SelectValue placeholder="Origem" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todas Origens</SelectItem>
                                <SelectItem value="KIWIFY">Kiwify</SelectItem>
                                <SelectItem value="HOTMART">Hotmart</SelectItem>
                                <SelectItem value="STRIPE">Stripe</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            className="h-14 px-6 rounded-2xl border-border/60 hover:bg-muted font-bold text-sm"
                            onClick={() => {
                                setStatusFilter("ALL");
                                setOriginFilter("ALL");
                                setSearch("");
                                toast.success("Filtros limpos!");
                            }}
                            title="Limpar Filtros"
                        >
                            <Filter size={18} className="mr-2" />
                            Predefinidos
                        </Button>
                    </div>
                </div>

                {viewMode === "TABLE" ? (
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        emptyMessage="Nenhuma venda encontrada para os termos buscados."
                        onRowClick={(item) => setSelectedSale(item)}
                    />
                ) : (
                    <div className="bg-card/30 rounded-[2rem] border border-border/40 p-6">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <h3 className="text-lg font-bold">Fluxo de Fechamento (Gantt)</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Ciclo de 7 dias</p>
                        </div>
                        <GanttChart data={ganttData} type="SALES" height={360} />
                    </div>
                )}
            </div>

            {/* New Sale Modal */}
            <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
                <DialogContent className="max-w-2xl rounded-[2rem] border-border/60 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Registrar Nova Venda</DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para registrar uma transação manualmente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 pointer-events-auto">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Nome do Cliente</Label>
                            <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="John Doe" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">E-mail</Label>
                            <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Produto</Label>
                            <Input value={form.produto} onChange={e => setForm(f => ({ ...f, produto: e.target.value }))} placeholder="Nome do Treinamento" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Valor (R$)</Label>
                            <Input
                                value={form.valor}
                                onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                                placeholder="0,00"
                                className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Origem da Venda</Label>
                            <Select value={form.origem} onValueChange={v => setForm(f => ({ ...f, origem: v }))}>
                                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40">
                                    <SelectValue placeholder="Selecione a origem" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="KIWIFY">Kiwify</SelectItem>
                                    <SelectItem value="HOTMART">Hotmart</SelectItem>
                                    <SelectItem value="STRIPE">Stripe</SelectItem>
                                    <SelectItem value="MANUAL">Lançamento Manual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Data</Label>
                            <Input value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} type="date" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setIsNewSaleOpen(false)} className="rounded-xl font-bold h-12" disabled={saving}>
                            Cancelar
                        </Button>
                        <Button
                            className="rounded-xl font-bold h-12 px-8 shadow-lg shadow-primary/20"
                            disabled={saving || !form.nome || !form.valor}
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    // Parse value handling Brazilian dot/comma typos
                                    const rawValue = form.valor.replace(/\./g, '').replace(',', '.');
                                    const parsedValor = parseFloat(rawValue);

                                    if (isNaN(parsedValor)) {
                                        throw new Error("Valor inválido. Use apenas números.");
                                    }

                                    await create({
                                        tipo: "RECEITA",
                                        status: "PENDENTE",
                                        data: form.data,
                                        valor: parsedValor,
                                        nome: form.nome,
                                        email: form.email,
                                        produto: form.produto,
                                        origem: form.origem as Transaction["origem"],
                                        categoria: "Venda",
                                        responsavel: "Manual",
                                        descricao: `Venda de ${form.produto}`,
                                    });
                                    toast.success("Venda registrada com sucesso!");
                                    setIsNewSaleOpen(false);
                                    setForm({ nome: "", email: "", produto: "", valor: "", origem: "MANUAL", data: new Date().toISOString().slice(0, 10) });
                                } catch (e: any) {
                                    console.error("Save error:", e);
                                    // Show precise error message from Supabase or custom error
                                    const errorMsg = e?.message || e?.details || "Erro desconhecido ao salvar.";
                                    toast.error(`Erro: ${errorMsg}`);
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                            Confirmar Registro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sale Details & Edit Modal */}
            <Dialog open={!!selectedSale} onOpenChange={(open) => {
                if (!open) {
                    setSelectedSale(null);
                    setIsEditing(false);
                }
            }}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border-border/60 p-0 overflow-hidden shadow-2xl">
                    {selectedSale && (
                        <>
                            <div className="bg-primary/5 p-8 pb-12 relative border-b border-primary/10">
                                <div className="absolute top-8 right-8">
                                    <Badge variant="success" className="rounded-xl px-4 py-1.5 font-bold uppercase tracking-wider border-none text-xs shadow-lg shadow-success/10">
                                        {selectedSale.status}
                                    </Badge>
                                </div>
                                <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
                                    <User size={32} />
                                </div>
                                {isEditing ? (
                                    <Input
                                        defaultValue={selectedSale.nome}
                                        className="text-3xl font-bold bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-1 p-0 h-auto"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-foreground leading-tight">{selectedSale.nome}</h2>
                                )}
                                <p className="text-muted-foreground font-medium mt-1 flex items-center gap-2 italic">
                                    <Mail size={14} /> {selectedSale.email}
                                </p>
                            </div>

                            <div className="p-8 bg-card rounded-t-[2.5rem] relative z-10 space-y-8 -mt-6 shadow-2xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 mb-1.5">
                                            <Tag size={12} /> {isEditing ? "Alterar Produto" : "Produto"}
                                        </p>
                                        {isEditing ? (
                                            <Input defaultValue={selectedSale.produto} className="h-10 rounded-xl bg-muted/40 border-none font-bold" />
                                        ) : (
                                            <p className="font-bold text-lg">{selectedSale.produto}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 mb-1.5 justify-end">
                                            <CreditCard size={12} /> Valor
                                        </p>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                defaultValue={selectedSale.valor}
                                                className="text-right font-bold text-2xl text-primary bg-transparent border-none p-0 h-auto"
                                            />
                                        ) : (
                                            <p className="font-bold text-2xl text-primary">{formatCurrency(selectedSale.valor)}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 mb-1.5">
                                            <Calendar size={12} /> {isEditing ? "Nova Data" : "Data da Transação"}
                                        </p>
                                        {isEditing ? (
                                            <Input type="date" defaultValue={selectedSale.data} className="h-10 rounded-xl bg-muted/40 border-none" />
                                        ) : (
                                            <p className="font-medium">{formatDate(selectedSale.data)}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 mb-1.5 justify-end">
                                            <ExternalLink size={12} /> Origem
                                        </p>
                                        <p className="font-medium">{selectedSale.origem}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-border/40">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Informações Adicionais</p>
                                    {isEditing ? (
                                        <Input defaultValue={selectedSale.descricao} className="h-20 rounded-xl bg-muted/30 border-border/40" />
                                    ) : (
                                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/30 text-sm italic">
                                            "{selectedSale.descricao}"
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-2">
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
                                                className="flex-1 h-12 rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
                                                onClick={() => {
                                                    toast.success("Venda atualizada com sucesso!");
                                                    setIsEditing(false);
                                                }}
                                            >
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
                                                className="flex-1 h-12 rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
                                                onClick={() => toast.success("Processando atualização no gateway...")}
                                            >
                                                Ações da Venda
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
