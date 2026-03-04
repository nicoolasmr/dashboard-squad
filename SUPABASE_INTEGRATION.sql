-- RPC: Processar Venda da Kiwify (V2 - Robusta)
-- Esta função recebe o JSON bruto da Kiwify e insere na tabela de transações
CREATE OR REPLACE FUNCTION process_kiwify_venda(payload jsonb)
RETURNS void AS $$
BEGIN
    INSERT INTO transactions (
        tipo,
        status,
        valor,
        nome,
        email,
        produto,
        origem,
        categoria,
        responsavel,
        descricao,
        data
    ) VALUES (
        'RECEITA',
        'APROVADO',
        COALESCE((payload->>'total_amount_cents')::numeric, 0) / 100,
        COALESCE(payload->>'customer_name', 'Cliente Kiwify'),
        COALESCE(payload->>'customer_email', 'contato@kiwify.com.br'),
        COALESCE(payload->>'product_name', 'Produto Kiwify'),
        'KIWIFY',
        'Venda',
        'Automático',
        'Webhook Kiwify: ' || COALESCE(payload->>'order_status', 'Aprovado'),
        COALESCE(
            CASE 
                WHEN payload->>'approved_date' IS NOT NULL THEN (payload->>'approved_date')::date 
                ELSE CURRENT_DATE 
            END, 
            CURRENT_DATE
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Processar Pagamento do Asaas (V2 - Robusta)
-- Esta função recebe o JSON bruto do Asaas e insere na tabela de transações
CREATE OR REPLACE FUNCTION process_asaas_pagamento(payload jsonb)
RETURNS void AS $$
DECLARE
    payment_obj jsonb;
BEGIN
    payment_obj := COALESCE(payload->'payment', payload); -- Asaas às vezes manda o objeto direto no teste
    
    INSERT INTO transactions (
        tipo,
        status,
        valor,
        nome,
        produto,
        origem,
        categoria,
        responsavel,
        descricao,
        data
    ) VALUES (
        'RECEITA',
        'APROVADO',
        COALESCE((payment_obj->>'value')::numeric, 0),
        COALESCE(payload->>'customer', 'Cliente Asaas'),
        COALESCE(payment_obj->>'description', 'Cobrança Asaas'),
        'ASAAS',
        'Venda',
        'Automático',
        'Pagamento Asaas via custom webhook',
        COALESCE(
            CASE 
                WHEN payment_obj->>'paymentDate' IS NOT NULL THEN (payment_obj->>'paymentDate')::date 
                ELSE CURRENT_DATE 
            END, 
            CURRENT_DATE
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
