// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Vercel exige que variáveis NEXT_PUBLIC_ sejam usadas em componentes client-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    console.warn("⚠️ AVISO: Supabase mal configurado. Verifique as chaves NEXT_PUBLIC_ no Vercel.");
}

export const supabase = createClient(
    supabaseUrl || "https://sxoayhdeeixjecbcfych.supabase.co",
    supabaseAnonKey || ""
);
