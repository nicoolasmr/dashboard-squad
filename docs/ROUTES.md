# Mapa de Rotas — Dashboard Squad

| URL              | Componente       | Hook(s)                        | Dados               |
|------------------|------------------|--------------------------------|---------------------|
| `/?tab=dashboard`| `DashboardView`  | `useTransactions`, `useGoals`  | KPIs, últimas tx    |
| `/?tab=sales`    | `SalesView`      | `useTransactions("RECEITA")`   | Receitas            |
| `/?tab=finance`  | `FinanceView`    | `useTransactions()`            | Despesas/Custos     |
| `/?tab=meetings` | `MeetingsView`   | `useMeetings`                  | Reuniões            |
| `/?tab=import`   | `ImportTool`     | —                              | Upload planilha     |
| `/?tv=1`         | `ModoTV`         | `useTransactions`, `useGoals`  | Slides auto-rotate  |

## Hooks

| Hook                           | Tabela Supabase  | Realtime | Soft Delete |
|-------------------------------|-----------------|----------|-------------|
| `useTransactions(tipo?)`       | `transactions`  | ✅       | ✅ `deleted_at` |
| `useMeetings()`                | `meetings`      | ✅       | ✅ `deleted_at` |
| `useGoals(mes?)`               | `goals`         | —        | —           |

## Schema

```
transactions → id, data, tipo, status, valor, categoria, responsavel, ...
meetings     → id, data_hora, titulo, cliente, owner, status, canal, notas
goals        → id, mes (UNIQUE), meta_receita, meta_vendas, meta_lucro
```

## RLS

All tables have `ENABLE ROW LEVEL SECURITY` with `public_all` policy (`USING (true)`) 
allowing all operations until auth is implemented.

> **Auth upgrade path:** Replace `USING (true)` with `USING (auth.uid() = user_id)` 
> and add `user_id uuid REFERENCES auth.users` column to each table.
