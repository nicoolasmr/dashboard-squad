# � Guia Passo a Passo: Integrando seu Dashboard com n8n (Nível Iniciante)

Se você nunca mexeu no n8n, não se preocupe! Vamos fazer isso juntos, clique a clique.

---

## 🟢 ETAPA 1: O Teste de Conexão (Rápido)
Antes de ligar as ferramentas reais, vamos garantir que o Dashboard "conversa" com o n8n.

1.  **No n8n:**
    *   Clique em **"Workflows"** na barra lateral esquerda.
    *   Clique em **"Add Workflow"** (botão no topo direito).
    *   **Atalho Mágico:** Copie todo o código JSON que está no final deste documento (Seção "ANEXO: Código de Teste") e dê um `Ctrl+V` (ou `Cmd+V`) bem no meio da tela branca do n8n.
    *   Clique no botão **"Save"** no topo.
    *   Clique em **"Execute Workflow"** (o botão vai virar um círculo girando escrito "Waiting for Webhook call").

2.  **No Dashboard:**
    *   Clique no ícone da **Engrenagem** (Configurações) no topo direito.
    *   No campo **"N8N Base URL"**, cole o endereço da sua instância do n8n (ex: `https://seu-nome.app.n8n.cloud`). **Importante:** Não coloque `/webhook` no final, apenas a URL base.
    *   Clique em **Salvar**.
    *   Clique no botão azul **"Tentar Sincronizar Agora"** que aparece no meio da tela.
    *   **Resultado:** Se os números mudarem para "R$ 15.450,50", sua conexão está nota 10!

---

## 🥝 ETAPA 2: Conectando a Kiwify (Vendas)

Agora vamos capturar vendas reais.

1.  **Crie a "Porta de Entrada" no n8n:**
    *   Clique no botão **(+)** no meio da tela e procure por **"Webhook"**.
    *   Configurações do Nó Webhook:
        *   **HTTP Method:** Mude para `POST`.
        *   **Path:** Digite `kiwify`.
        *   **Authentication:** Deixe em `None` por enquanto.
    *   Clique na aba **"Test URL"** (em cima do endereço que ele gerou) e clique no endereço para copiar. Ele deve ser algo como `.../webhook-test/kiwify`.

2.  **Ligue a torneira na Kiwify:**
    *   Abra o painel da **Kiwify**.
    *   Vá em **Apps** -> **Webhooks**.
    *   Clique em **"Novo Webhook"**.
    *   Nome: `Dashboard Squad`.
    *   URL de Webhook: Cole o link que você copiou do n8n.
    *   Eventos: Marque apenas **"Venda Aprovada"**.
    *   Clique em **Salvar**.

3.  **Teste o Recebimento:**
    *   No n8n, clique em **"Listen for test event"** dentro do nó Webhook.
    *   Na Kiwify, clique no botão **"Enviar Teste"** (geralmente um ícone de raio ou botão de teste ao lado do webhook criado).
    *   **Verificação:** O n8n deve piscar verde e mostrar uma lista de dados (nome, email, valor).

---

## 🏦 ETAPA 3: Conectando o Asaas (Pagamentos)

O processo é quase igual, mas o "bilhete" do Asaas é diferente.

1.  **No n8n:** Crie outro nó **Webhook**, `POST`, Path: `asaas`. Copie a URL de Teste.
2.  **No Asaas:** 
    *   Vá em **Configurações de Conta** -> **Integrações**.
    *   Clique em **Webhooks** -> **Webhook para cobranças**.
    *   URL: Cole o link do n8n.
    *   Versão da API: Deixe a mais recente (v3).
    *   Eventos: Marque **"Pagamento confirmado"**.
    *   Clique em **Salvar**.
3.  **Teste:** O Asaas também permite enviar um "Evento de Teste". Faça isso e veja se o dado chega no n8n.

---

## 🔄 ETAPA 4: Traduzindo os Dados (O Nó "Set")

Aqui está o segredo. Cada ferramenta envia o nome do comprador de um jeito:
*   Kiwify envia como: `customer_name`
*   Asaas envia como: `customer` (geralmente um ID que você precisa buscar o nome)

Para facilitar, use um nó chamado **"Edit Fields"** (antigo "Set") após o Webhook para renomear tudo para o padrão do Dashboard:
*   `nome`
*   `valor`
*   `produto`
*   `status`

---

## 📦 ANEXO: Código de Teste (Copie e Cole no n8n)

```json
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "GET",
        "path": "api/dashboard",
        "options": {}
      },
      "id": "test-webhook",
      "name": "Webhook: Get Dashboard",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [400, 300],
      "webhookId": "api-dashboard"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\n  \"kpis\": {\n    \"receita_aprovada\": 15450.50,\n    \"receita_total\": 22000.00,\n    \"custos_total\": 4500.00,\n    \"lucro\": 10950.50\n  },\n  \"transactions\": [\n    { \"id\": \"1\", \"nome\": \"Nicolas Moreira\", \"produto\": \"Venda de Teste\", \"valor\": 2500, \"status\": \"aprovada\", \"data_hora\": \"{{ $now.toISO() }}\" }\n  ],\n  \"meetings\": []\n}",
        "options": {}
      },
      "id": "test-response",
      "name": "Respond to Dashboard",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [600, 300]
    }
  ],
  "connections": {
    "Webhook: Get Dashboard": {
      "main": [[{ "node": "Respond to Dashboard", "type": "main", "index": 0 }]]
    }
  }
}
```

---

**Dica para os próximos dias:** Agora que você é iniciante, minha recomendação é salvar esses dados em uma **Planilha Google Sheets** usando o n8n. Assim, se o n8n parar, seus dados estão seguros na planilha e o Dashboard lê de lá!

Quer que eu te mostre como configurar esse nó do Google Sheets?
