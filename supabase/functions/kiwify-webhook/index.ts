import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    try {
        const payload = await req.json()

        // Auth: Verifique uma chave secreta no header se desejar (opcional)
        // No painel da Kiwify, você pode adicionar parâmetros na URL se precisar

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { error } = await supabaseAdmin.rpc('process_kiwify_venda', {
            payload
        })

        if (error) throw error

        return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" }
        })
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        })
    }
})
