import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ ERRO: Variáveis do Supabase não encontradas! Verifique o .env.local ou as chaves no Vercel.");
}

export const supabase = createClient(
    supabaseUrl || "https://missing-url.supabase.co",
    supabaseAnonKey || "missing-key"
);
