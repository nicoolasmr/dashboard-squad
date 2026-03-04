"use client";

import React, { useState, useEffect } from "react";
import { Target, Check, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGoals } from "@/hooks/useGoals";
import { toast } from "sonner";

interface GoalsConfigProps {
    open: boolean;
    onClose: () => void;
}

export function GoalsConfig({ open, onClose }: GoalsConfigProps) {
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7)); // "2026-03"
    const { goal, save, loading: loadingGoal } = useGoals(selectedMonth);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        meta_receita: "",
        meta_vendas: "",
        meta_lucro: "",
    });

    // Pre-fill form when goal loads or month changes
    useEffect(() => {
        if (goal) {
            setForm({
                meta_receita: goal.meta_receita ? String(goal.meta_receita) : "",
                meta_vendas: goal.meta_vendas ? String(goal.meta_vendas) : "",
                meta_lucro: goal.meta_lucro ? String(goal.meta_lucro) : "",
            });
        } else {
            setForm({ meta_receita: "", meta_vendas: "", meta_lucro: "" });
        }
    }, [goal, selectedMonth]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await save({
                meta_receita: Number(form.meta_receita.replace(",", ".")) || 0,
                meta_vendas: Number(form.meta_vendas) || 0,
                meta_lucro: Number(form.meta_lucro.replace(",", ".")) || 0,
            });
            toast.success("✅ Meta salva com sucesso!");
            onClose();
        } catch {
            toast.error("Erro ao salvar meta.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-[2.5rem] border-border/60 p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        Definir Meta Mensal
                    </DialogTitle>
                    <DialogDescription>
                        Ajuste as metas para o período selecionado. As barras de progresso atualizam automaticamente.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-5 my-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">
                            Mês de Referência
                        </Label>
                        <Input
                            type="month"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="h-12 rounded-xl bg-muted/30 border-border/40 text-lg font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">
                            Meta de Receita (R$)
                        </Label>
                        <Input
                            placeholder="Ex: 150000"
                            value={form.meta_receita}
                            onChange={e => setForm(f => ({ ...f, meta_receita: e.target.value }))}
                            className="h-12 rounded-xl bg-muted/30 border-border/40 text-lg font-bold"
                            disabled={loadingGoal}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">
                            Meta de Vendas (qtd)
                        </Label>
                        <Input
                            placeholder="Ex: 150"
                            value={form.meta_vendas}
                            onChange={e => setForm(f => ({ ...f, meta_vendas: e.target.value }))}
                            className="h-12 rounded-xl bg-muted/30 border-border/40 text-lg font-bold"
                            disabled={loadingGoal}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">
                            Meta de Lucro (R$)
                        </Label>
                        <Input
                            placeholder="Ex: 80000"
                            value={form.meta_lucro}
                            onChange={e => setForm(f => ({ ...f, meta_lucro: e.target.value }))}
                            className="h-12 rounded-xl bg-muted/30 border-border/40 text-lg font-bold"
                            disabled={loadingGoal}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        className="rounded-xl border-border/60 hover:bg-muted/50"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="rounded-xl gap-2 px-8 bg-primary font-bold"
                        onClick={handleSave}
                        disabled={saving || loadingGoal}
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        {saving ? "Salvando..." : "Salvar Meta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
