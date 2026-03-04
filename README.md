# Dashboard Operacional | Squad

Um dashboard premium SaaS autônomo projetado para operação em tempo real e exibição em centros de comando (Modo TV), integrado nativamente com o n8n Cloud.

## 🚀 Funcionalidades Principais

*   **Visão Geral (BI)**: Gráficos interativos de Receita, Despesas e Origem de Vendas usando Recharts.
*   **Gestão de Vendas**: Tabela dinâmica com ações rápidas para aprovação e estorno de transações.
*   **Controle Financeiro**: Gestão dual de Despesas e Custos com cálculo automático de totais.
*   **Agenda de Reuniões**: Cronograma diário com ícones de canal (Zoom, Meet, Call) e controle de status.
*   **Importação Inteligente**: Ferramenta de importação de planilhas (CSV/XLSX) com mapeamento de colunas dinâmico.
*   **Modo TV Center**: Interface de alta visibilidade com rotação automática de telas a cada 15 segundos e sincronização em tempo real.

## 🛠️ Stack Tecnológica

*   **Framework**: Next.js 15 (App Router)
*   **Estilização**: Tailwind CSS v4 + Glassmorphism
*   **Animações**: Framer Motion
*   **Ícones**: Lucide React
*   **Gráficos**: Recharts
*   **API**: Integração transparente com Webhooks do n8n

## 🔗 Integração com n8n

O dashboard consome dados via cabeçalhos de segurança customizados. 

### Configuração
1. Vá em **Configurações** (ícone de engrenagem no Navbar).
2. Configure a **Base URL** da sual instância n8n.
3. Defina o seu **X-DASH-TOKEN** (Token de segurança).

### Webhooks Necessários
O `N8nService` espera os seguintes endpoints configurados no seu n8n:
*   `GET /webhook/api/dashboard`: Dados consolidados para os KPIs e gráficos.
*   `POST /webhook/api/transactions`: Registro de novas vendas/despesas.
*   `GET /webhook/api/meetings`: Lista de reuniões agendadas.

## 🛡️ Segurança

*   **Zero Hardcoded Secrets**: Todas as credenciais são armazenadas no `localStorage` do cliente.
*   **Sanitização**: Uso estrito de `URLSearchParams` para prevenir injeções em rotas dinâmicas.
*   **HTTPS**: Recomenda-se o deployment sob SSL para proteger o Token em trânsito.

## 📦 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) para acessar a interface de operação.
Adicione `?tv=1` à URL para entrar diretamente no **Modo TV**.

---
Desenvolvido com ⚡ por Antigravity.
