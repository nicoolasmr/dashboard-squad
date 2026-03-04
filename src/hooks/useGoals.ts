"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Goal {
    id: string;
    mes: string;
    meta_receita: number | null;
    meta_vendas: number | null;
    meta_lucro: number | null;
}

export function useGoals(mes?: string) {
    const currentMes = mes ?? new Date().toISOString().slice(0, 7); // "2026-03"
    const [goal, setGoal] = useState<Goal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: row, error: err } = await supabase
                .from("goals")
                .select("*")
                .eq("mes", currentMes)
                .maybeSingle();

            if (err) throw err;
            setGoal(row as Goal | null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao carregar meta");
        } finally {
            setLoading(false);
        }
    }, [currentMes]);

    useEffect(() => { fetch(); }, [fetch]);

    const save = useCallback(
        async (payload: Omit<Goal, "id" | "mes">) => {
            const { data: row, error: err } = await supabase
                .from("goals")
                .upsert({ mes: currentMes, ...payload }, { onConflict: "mes" })
                .select()
                .single();
            if (err) throw err;
            setGoal(row as Goal);
            return row as Goal;
        },
        [currentMes]
    );

    return { goal, loading, error, save, refresh: fetch };
}

/** Utility: compute % of goal reached */
export function goalProgress(current: number, target: number | null): number {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 999);
}

/** Utility: color token based on progress */
export function progressColor(pct: number): string {
    if (pct >= 100) return "var(--success, #10b981)";
    if (pct >= 70) return "var(--warning, #f59e0b)";
    return "var(--destructive, #ef4444)";
}
