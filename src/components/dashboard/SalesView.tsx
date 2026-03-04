"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, User, Mail, CreditCard, Calendar, Tag, ExternalLink } from "lucide-react";
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
    const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Transaction | null>(null);
    const [search, setSearch] = useState("");

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

    const filteredData = data.filter(item =>
        item.nome?.toLowerCase().includes(search.toLowerCase()) ||
        item.produto?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Vendas</h1>
                    <p className="text-muted-foreground mt-2 text-sm font-medium">Acompanhamento em tempo real de suas conversões.</p>
                </div>
                <Button
                    onClick={() => setIsNewSaleOpen(true)}
                    className="h-12 px-8 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus size={20} className="mr-2" />
                    Registrar Venda
                </Button>
            </div>

            {/* Table section */}
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-border/60 shadow-premium flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                        <Input
                            placeholder="Buscar cliente, produto ou email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-14 pl-12 pr-4 bg-muted/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-base"
                        />
                    </div>
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/60 hover:bg-muted font-bold text-sm">
                        <Filter size={18} className="mr-2" />
                        Filtros Avançados
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    emptyMessage="Nenhuma venda encontrada para os termos buscados."
                    onRowClick={(item) => setSelectedSale(item)}
                />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                        <div className="space-y-2">
                            <Label htmlFor="nome" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Nome do Cliente</Label>
                            <Input id="nome" placeholder="John Doe" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">E-mail</Label>
                            <Input id="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="produto" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Produto</Label>
                            <Input id="produto" placeholder="Nome do Treinamento" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="valor" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Valor (R$)</Label>
                            <Input id="valor" type="number" step="0.01" placeholder="0,00" className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="origem" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Origem da Venda</Label>
                            <Select>
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
                            <Label htmlFor="data" className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Data</Label>
                            <Input id="data" type="date" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button variant="ghost" onClick={() => setIsNewSaleOpen(false)} className="rounded-xl font-bold h-12">
                            Cancelar
                        </Button>
                        <Button
                            className="rounded-xl font-bold h-12 px-8"
                            onClick={() => {
                                toast.success("Venda enviada para processamento no n8n!");
                                setIsNewSaleOpen(false);
                            }}
                        >
                            Confirmar Registro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sale Details Modal */}
            <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
                <DialogContent className="max-w-xl rounded-[2.5rem] border-border/60 p-0 overflow-hidden">
                    {selectedSale && (
                        <>
                            <div className="bg-primary/5 p-8 pb-12 relative">
                                <div className="absolute top-8 right-8">
                                    <Badge variant="success" className="rounded-xl px-4 py-1.5 font-bold uppercase tracking-wider border-none text-xs shadow-lg shadow-success/10">
                                        {selectedSale.status}
                                    </Badge>
                                </div>
                                <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
                                    <User size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-foreground leading-tight">{selectedSale.nome}</h2>
                                <p className="text-muted-foreground font-medium mt-1 flex items-center gap-2 italic">
                                    <Mail size={14} /> {selectedSale.email}
                                </p>
                            </div>

                            <div className="p-8 bg-card rounded-t-[2rem] border-t border-border/50 relative z-10 space-y-8 -mt-4 ring-1 ring-black/5 shadow-2xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 mb-1.5">
                                            <Tag size={12} /> Produto
                                        </p>
                                        <p className="font-bold text-lg">{selectedSale.produto}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 mb-1.5 justify-end">
                                            <CreditCard size={12} /> Valor
                                        </p>
                                        <p className="font-bold text-2xl text-primary">{formatCurrency(selectedSale.valor)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5 mb-1.5">
                                            <Calendar size={12} /> Data da Transação
                                        </p>
                                        <p className="font-medium">{formatDate(selectedSale.data)}</p>
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
                                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/30 text-sm italic">
                                        "{selectedSale.descricao}"
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl font-bold border-border/60"
                                        onClick={() => toast.info("Funcionalidade de edição disponível em breve!")}
                                    >
                                        Editar Dados
                                    </Button>
                                    <Button
                                        className="flex-1 h-12 rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
                                        onClick={() => toast.success("Ação processada com sucesso!")}
                                    >
                                        Ações da Venda
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
