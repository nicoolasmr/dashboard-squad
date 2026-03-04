"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Transaction, TransactionType } from "@/types/dashboard";

export function useTransactions(tipo?: TransactionType) {
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from("transactions")
                .select("*")
                .is("deleted_at", null)
                .order("data", { ascending: false });

            if (tipo) {
                query = query.eq("tipo", tipo);
            }

            const { data: rows, error: err } = await query;
            if (err) throw err;
            setData((rows ?? []) as Transaction[]);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao carregar transações");
        } finally {
            setLoading(false);
        }
    }, [tipo]);

    useEffect(() => {
        fetch();

        // Real-time subscription
        const channel = supabase
            .channel("transactions_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "transactions" },
                () => fetch()
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [fetch]);

    const create = useCallback(async (payload: Omit<Transaction, "id">) => {
        const { data: row, error: err } = await supabase
            .from("transactions")
            .insert(payload)
            .select()
            .single();
        if (err) throw err;
        return row as Transaction;
    }, []);

    const update = useCallback(async (id: string, payload: Partial<Transaction>) => {
        const { error: err } = await supabase
            .from("transactions")
            .update(payload)
            .eq("id", id);
        if (err) throw err;
    }, []);

    const remove = useCallback(async (id: string) => {
        // Soft delete
        const { error: err } = await supabase
            .from("transactions")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id);
        if (err) throw err;
    }, []);

    return { data, loading, error, create, update, remove, refresh: fetch };
}
