# Dashboard Operacional | Squad

Um dashboard premium SaaS autônomo projetado para operação em tempo real e exibição em centros de comando (Modo TV), integrado nativamente com o n8n Cloud.

## 🚀 Funcionalidades Principais

*   **Visão Geral (BI)**: Gráficos interativos de Receita, Despesas e Origem de Vendas usando Recharts.
*   **Gestão de Vendas**: Tabela dinâmica com **filtros avançados por status e origem**.
*   **Controle Financeiro**: Gestão dual de Despesas e Custos com **campos de recorrência** e exclusão permanente.
*   **Modo Edição (Full Edit)**: Fluxo completo de edição para clientes, valores e reuniões diretamente nos detalhes.
*   **Agenda de Reuniões**: Cronograma diário com ícones de canal e filtros inteligentes.
*   **Modo TV Center 2.0**: Interface ultra-responsiva com **tipografia fluida (clamp)** para estatísticas gigantes e abertura em aba externa.
*   **Estabilidade Operacional**: Z-index harmonizado e interatividade total em modais.
*   **Roadmap 2026**: Planejamento integrado para visualizações de Gantt.

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
