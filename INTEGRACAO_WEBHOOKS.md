# 🔗 Guia de Integração: Webhooks Nativos (Kiwify & Asaas)

Agora que suas **Edge Functions** estão publicadas, o Dashboard receberá os dados automaticamente sem depender de ferramentas externas como o n8n.

---

## 🥝 1. Configurando na Kiwify

1.  Acesse o painel da **Kiwify** -> **Webhooks**.
2.  Clique em **"Criar Webhook"**.
3.  **Nome:** Dashboard Squad (Vendas)
4.  **URL do Webhook:** 
    `https://sxoayhdeeixjecbcfych.supabase.co/functions/v1/kiwify-webhook`
5.  **Eventos:** Marque apenas **"Venda Aprovada"**.
6.  Clique em **Salvar**.

---

## 🏦 2. Configurando no Asaas

1.  Acesse o painel do **Asaas** -> **Configurações da Conta** -> **Integrações**.
2.  Clique na aba **"Webhooks"** e depois em **"Webhook de Cobranças"**.
3.  **URL do Webhook:** 
    `https://sxoayhdeeixjecbcfych.supabase.co/functions/v1/asaas-webhook`
4.  **Eventos:** Marque **"Pagamento Confirmado"** ou **"Recebido"**.
5.  **Token:** Se você definir um token no Asaas, me avise para eu atualizar a segurança da sua função. Por enquanto, ela aceita todos os envios.
6.  Clique em **Salvar**.

---

## ⚡ Como testar?

Ao configurar na Kiwify, clique no botão **"Enviar teste"**.
O Dashboard deve detectar a nova venda **instantanemente** no gráfico e na lista, sem que você precise atualizar a página.

**Parabéns!** Seu sistema agora é 100% independente e profissional. 🚀💎
