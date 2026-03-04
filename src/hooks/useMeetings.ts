"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Meeting } from "@/types/dashboard";

export function useMeetings() {
    const [data, setData] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: rows, error: err } = await supabase
                .from("meetings")
                .select("*")
                .is("deleted_at", null)
                .order("data_hora", { ascending: false });

            if (err) throw err;
            setData((rows ?? []) as Meeting[]);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao carregar reuniões");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();

        const channel = supabase
            .channel("meetings_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "meetings" },
                () => fetch()
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [fetch]);

    const create = useCallback(async (payload: Omit<Meeting, "id">) => {
        const { data: row, error: err } = await supabase
            .from("meetings")
            .insert(payload)
            .select()
            .single();
        if (err) throw err;
        return row as Meeting;
    }, []);

    const update = useCallback(async (id: string, payload: Partial<Meeting>) => {
        const { error: err } = await supabase
            .from("meetings")
            .update(payload)
            .eq("id", id);
        if (err) throw err;
    }, []);

    const remove = useCallback(async (id: string) => {
        const { error: err } = await supabase
            .from("meetings")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id);
        if (err) throw err;
    }, []);

    return { data, loading, error, create, update, remove, refresh: fetch };
}
