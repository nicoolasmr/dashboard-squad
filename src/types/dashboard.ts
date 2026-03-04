export type TransactionType = 'RECEITA' | 'DESPESA' | 'CUSTO';

export type TransactionStatus =
    | 'APROVADO'
    | 'PENDENTE'
    | 'PAGO'
    | 'PREVISTO'
    | 'REEMBOLSADO'
    | 'CANCELADO';

export type OriginType =
    | 'KIWIFY'
    | 'HOTMART'
    | 'STRIPE'
    | 'MANUAL'
    | 'PLANILHA'
    | 'OUTRO';

export type MeetingStatus =
    | 'MARCADA'
    | 'FEITA'
    | 'NO_SHOW'
    | 'REMARCADA'
    | 'CANCELADA';

export type MeetingChannel = 'ZOOM' | 'MEET' | 'PRESENCIAL' | 'CALL';

export interface Transaction {
    id: string;
    data: string;
    tipo: TransactionType;
    status: TransactionStatus;
    valor: number;
    categoria: string;
    subcategoria?: string;
    origem?: OriginType;
    produto?: string;
    nome?: string;
    email?: string;
    telefone?: string;
    responsavel: string;
    descricao?: string;
    recorrencia?: 'PONTUAL' | 'RECORRENTE';
    parcelas?: number;
    recorrencia_periodo?: string;
}

export interface Meeting {
    id: string;
    data_hora: string;
    titulo: string;
    cliente: string;
    owner: string;
    status: MeetingStatus;
    canal: MeetingChannel;
    notas?: string;
}

export interface DashboardKPIs {
    receita_aprovada: number;
    receita_total: number;
    despesas_total: number;
    custos_total: number;
    lucro: number;
    vendas_qtd: number;
    pendentes_qtd: number;
}

export interface DashboardData {
    kpis: DashboardKPIs;
    transactions: Transaction[];
    meetings: Meeting[];
}

export interface ApiResponse<T> {
    ok: boolean;
    data?: T;
    error?: string;
}

export interface ImportResult {
    ok: boolean;
    inserted: number;
    rejected: number;
    errors: Array<{ rowIndex: number; reason: string }>;
}
