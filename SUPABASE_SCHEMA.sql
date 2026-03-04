-- SCHEMA DO SUPABASE: DASHBOARD SQUAD
-- Copie e cole este código no SQL Editor do seu projeto Supabase

-- 1. Tabela de Transações (Vendas, Despesas, Custos)
CREATE TABLE IF NOT EXISTS transactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data         date NOT NULL DEFAULT CURRENT_DATE,
  tipo         text NOT NULL CHECK (tipo IN ('RECEITA','DESPESA','CUSTO')),
  status       text NOT NULL CHECK (status IN (
                 'APROVADO','PENDENTE','PAGO','PREVISTO','REEMBOLSADO','CANCELADO'
               )),
  valor        numeric(12,2) NOT NULL,
  categoria    text NOT NULL,
  subcategoria text,
  origem       text CHECK (origem IN ('KIWIFY','HOTMART','STRIPE','MANUAL','PLANILHA','ASAAS','OUTRO')),
  produto      text,
  nome         text,
  email        text,
  telefone     text,
  responsavel  text NOT NULL,
  descricao    text,
  recorrencia  text DEFAULT 'PONTUAL' CHECK (recorrencia IN ('PONTUAL','RECORRENTE')),
  parcelas     smallint DEFAULT 1 CHECK (parcelas > 0),
  recorrencia_periodo text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  deleted_at   timestamptz  -- soft delete
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_transactions_tipo_data ON transactions(tipo, data DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status) WHERE deleted_at IS NULL;

-- 2. Tabela de Reuniões (Calendário)
CREATE TABLE IF NOT EXISTS meetings (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_hora timestamptz NOT NULL,
  titulo    text NOT NULL,
  cliente   text,
  owner     text,
  status    text NOT NULL CHECK (status IN (
              'MARCADA','FEITA','NO_SHOW','REMARCADA','CANCELADA'
            )),
  canal     text CHECK (canal IN ('ZOOM','MEET','PRESENCIAL','CALL')),
  notas     text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  deleted_at  timestamptz
);

CREATE INDEX IF NOT EXISTS idx_meetings_data_hora ON meetings(data_hora DESC) WHERE deleted_at IS NULL;

-- 3. Tabela de Metas (Mensal)
CREATE TABLE IF NOT EXISTS goals (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mes          text NOT NULL UNIQUE,  -- Formato: "2026-03"
  meta_receita numeric(12,2) DEFAULT 0,
  meta_vendas  smallint DEFAULT 0,
  meta_lucro   numeric(12,2) DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- 4. Segurança (RLS - Row Level Security)
-- Habilita segurança nas tabelas
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Permite acesso total para qualquer pessoa (Ajustar quando houver login)
DROP POLICY IF EXISTS "public_all" ON transactions;
CREATE POLICY "public_all" ON transactions FOR ALL USING (true);

DROP POLICY IF EXISTS "public_all" ON meetings;
CREATE POLICY "public_all" ON meetings FOR ALL USING (true);

DROP POLICY IF EXISTS "public_all" ON goals;
CREATE POLICY "public_all" ON goals FOR ALL USING (true);

-- 5. Função de Auto-Update para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
