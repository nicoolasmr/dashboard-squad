"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, Wallet, Receipt, Calendar, User, Tag, MoreHorizontal } from "lucide-react";
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
    const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Transaction | null>(null);
    const [search, setSearch] = useState("");

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
                    // @ts-ignore
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
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRecord(item);
                }}>
                    <MoreHorizontal size={16} className="text-muted-foreground" />
                </Button>
            )
        },
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

    const filteredData = data.filter(item =>
        item.descricao.toLowerCase().includes(search.toLowerCase()) ||
        item.categoria.toLowerCase().includes(search.toLowerCase()) ||
        item.responsavel.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Custos & Despesas</h1>
                    <p className="text-muted-foreground mt-2 text-sm font-medium">Controle total do fluxo de saída e saúde financeira.</p>
                </div>
                {/* @ts-ignore */}
                <Button
                    onClick={() => setIsNewRecordOpen(true)}
                    variant="destructive"
                    className="h-12 px-8 rounded-2xl font-bold text-base shadow-xl shadow-error/20 hover:shadow-error/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus size={20} className="mr-2" />
                    Novo Lançamento
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2rem] border-border/60 shadow-premium overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="p-4 bg-success/10 text-success rounded-[1.25rem] group-hover:bg-success group-hover:text-white transition-all duration-500">
                            <ArrowUpCircle size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">Total Liquidado</p>
                            <p className="text-2xl font-bold text-foreground">{formatCurrency(2450)}</p>
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
                            <p className="text-2xl font-bold text-foreground">{formatCurrency(12000)}</p>
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
                            <p className="text-2xl font-bold text-primary">{formatCurrency(-14450)}</p>
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

                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1 max-w-md">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                            <Input
                                placeholder="Buscar lançamento..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 pl-12 bg-muted/30 border-border/50 rounded-xl"
                            />
                        </div>
                        {/* @ts-ignore */}
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/60">
                            <Filter size={18} />
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="Nenhum registro encontrado."
                    onRowClick={(item) => setSelectedRecord(item)}
                />
            </div>

            {/* New Record Modal */}
            <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                <DialogContent className="max-w-2xl rounded-[2.5rem] border-border/60 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Registrar {activeSubTab === 'DESPESA' ? 'Despesa' : 'Custo'}</DialogTitle>
                        <DialogDescription>
                            Insira os detalhes do lançamento financeiro para processamento.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="desc" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Descrição do Gasto</Label>
                            <Input id="desc" placeholder="Ex: Upgrade Servidores AWS" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Categoria</Label>
                            <Select>
                                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inf">Infraestrutura</SelectItem>
                                    <SelectItem value="mkt">Marketing</SelectItem>
                                    <SelectItem value="ops">Operação</SelectItem>
                                    <SelectItem value="ppl">Pessoal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="val" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Valor (R$)</Label>
                            <Input id="val" type="number" step="0.01" placeholder="0,00" className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Data</Label>
                            <Input id="date" type="date" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resp" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Responsável</Label>
                            <Input id="resp" placeholder="Nome ou Setor" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                    </div>

                    {/* @ts-ignore */}
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setIsNewRecordOpen(false)} className="rounded-xl font-bold h-12">
                            Cancelar
                        </Button>
                        {/* @ts-ignore */}
                        <Button
                            variant="destructive"
                            className="rounded-xl font-bold h-12 px-8"
                            onClick={() => {
                                toast.success("Lançamento agendado no n8n!");
                                setIsNewRecordOpen(false);
                            }}
                        >
                            Salvar Transação
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Details Modal */}
            <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border-border/60 p-0 overflow-hidden">
                    {selectedRecord && (
                        <>
                            <div className="bg-error/5 p-8 pb-12 relative border-b border-error/10">
                                <div className="absolute top-8 right-8">
                                    {/* @ts-ignore */}
                                    <Badge variant={selectedRecord.status === 'PAGO' ? 'success' : 'warning'} className="rounded-xl px-4 py-1.5 font-bold uppercase tracking-wider border-none text-xs">
                                        {selectedRecord.status}
                                    </Badge>
                                </div>
                                <div className="w-16 h-16 bg-error rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-error/20">
                                    <Receipt size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground leading-tight italic">"{selectedRecord.descricao}"</h2>
                                <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <Wallet size={14} /> Transação ID: {selectedRecord.id}
                                </p>
                            </div>

                            <div className="p-8 bg-card relative z-10 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 line-clamp-1">
                                            <Tag size={12} className="inline mr-1" /> Categoria Principal
                                        </p>
                                        <p className="font-bold text-lg">{selectedRecord.categoria}</p>
                                        <p className="text-xs text-muted-foreground italic">{selectedRecord.subcategoria}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 justify-end flex items-center">
                                            <Wallet size={12} className="inline mr-1" /> Valor do Gasto
                                        </p>
                                        <p className="font-bold text-3xl text-error">{formatCurrency(selectedRecord.valor)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">
                                            <Calendar size={12} className="inline mr-1" /> Data do Lançamento
                                        </p>
                                        <p className="font-medium">{formatDate(selectedRecord.data)}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5 justify-end flex items-center">
                                            <User size={12} className="inline mr-1" /> Autorizado por
                                        </p>
                                        <p className="font-medium text-foreground">{selectedRecord.responsavel}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-border/60">
                                        Gerar Recibo
                                    </Button>
                                    <Button variant="destructive" className="flex-1 h-12 rounded-xl font-bold px-8">
                                        Estornar Gasto
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
