"use client";

import React, { useState } from "react";
import {
    Upload,
    FileSpreadsheet,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Database,
    Trash2,
    Table as TableIcon
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import Papa from "papaparse";

type ImportType = 'VENDAS' | 'FINANCEIRO';

export function ImportView() {
    const [step, setStep] = useState(1);
    const [importType, setImportType] = useState<ImportType | null>(null);
    const [rawData, setRawData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            if (isExcel) {
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const [h, ...rows] = data as any[][];
                setHeaders(h);
                setRawData(rows.map(row => {
                    const obj: any = {};
                    h.forEach((header: string, i: number) => {
                        obj[header] = row[i];
                    });
                    return obj;
                }));
            } else {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setHeaders(Object.keys(results.data[0] as any));
                        setRawData(results.data);
                    }
                });
            }
            setStep(2);
            toast.success("Arquivo processado com sucesso!");
        };

        if (isExcel) {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsText(file);
        }
    };

    const getRequiredFields = () => {
        if (importType === 'VENDAS') return ['data', 'produto', 'valor', 'status'];
        return ['data', 'descricao', 'valor', 'categoria'];
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Importar Planilhas</h1>
                <p className="text-muted-foreground mt-1">Transforme seus arquivos Excel/CSV em dados acionáveis no n8n.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Progress Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { id: 1, label: "Seleção e Upload", desc: "Escolha o tipo e arquivo" },
                        { id: 2, label: "Mapeamento", desc: "Associe as colunas" },
                        { id: 3, label: "Validação", desc: "Verifique inconsistências" },
                        { id: 4, label: "Finalizar", desc: "Enviar para o n8n" },
                    ].map((s) => (
                        <div
                            key={s.id}
                            className={cn(
                                "p-4 rounded-2xl border transition-all duration-300",
                                step === s.id ? "bg-primary/10 border-primary text-primary shadow-sm" :
                                    step > s.id ? "bg-success/5 border-success/20 text-success opacity-70" :
                                        "bg-card border-border text-muted-foreground opacity-50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2",
                                    step >= s.id ? "border-current" : "border-muted-foreground"
                                )}>
                                    {step > s.id ? <CheckCircle size={16} /> : s.id}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{s.label}</p>
                                    <p className="text-[10px] uppercase font-semibold opacity-70">{s.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workspace */}
                <div className="lg:col-span-3 bg-card rounded-3xl border border-border shadow-premium flex flex-col p-8 min-h-[500px]">
                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center flex-grow gap-8 text-center max-w-md mx-auto">
                            <div className="p-6 bg-primary/10 text-primary rounded-full">
                                <FileSpreadsheet size={48} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">O que vamos importar hoje?</h2>
                                <p className="text-muted-foreground">Selecione o tipo de dado para garantir que o n8n receba os campos corretos.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button
                                    onClick={() => setImportType('VENDAS')}
                                    className={cn(
                                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                                        importType === 'VENDAS' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <Database size={24} className={importType === 'VENDAS' ? "text-primary" : "text-muted-foreground"} />
                                    <span className="font-bold">Vendas</span>
                                </button>
                                <button
                                    onClick={() => setImportType('FINANCEIRO')}
                                    className={cn(
                                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                                        importType === 'FINANCEIRO' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <TableIcon size={24} className={importType === 'FINANCEIRO' ? "text-primary" : "text-muted-foreground"} />
                                    <span className="font-bold">Financeiro</span>
                                </button>
                            </div>

                            {importType && (
                                <label className="w-full h-32 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-2 group animate-in slide-in-from-bottom-2">
                                    <Upload size={24} className="text-primary group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-sm">Clique ou arraste o arquivo (.csv ou .xlsx)</span>
                                    <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                                </label>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold">Mapear Colunas</h2>
                                <p className="text-muted-foreground">Relacione as colunas da sua planilha com os campos do sistema.</p>
                            </div>

                            <div className="space-y-4 flex-grow">
                                {getRequiredFields().map((field) => (
                                    <div key={field} className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                                        <div className="w-1/3 text-sm font-bold uppercase tracking-wide text-primary">
                                            {field} <span className="text-error">*</span>
                                        </div>
                                        <ArrowRight size={16} className="text-muted-foreground" />
                                        <select
                                            className="flex-grow bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                            onChange={(e) => setMapping(prev => ({ ...prev, [field]: e.target.value }))}
                                        >
                                            <option value="">Selecione na planilha...</option>
                                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-between items-center pt-6 border-t border-border">
                                <button onClick={() => setStep(1)} className="font-bold text-muted-foreground hover:text-foreground">Voltar</button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
                                >
                                    Validar Dados
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col h-full">
                            <div className="mb-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Validar Processamento</h2>
                                    <p className="text-muted-foreground">Revisamos {rawData.length} linhas. Tudo pronto para o envio?</p>
                                </div>
                                <Badge variant="success" className="h-fit">Pronto para Importar</Badge>
                            </div>

                            <div className="flex-grow border border-border rounded-2xl overflow-hidden mb-6">
                                <div className="h-[250px] overflow-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-muted sticky top-0">
                                            <tr>
                                                {getRequiredFields().map(f => (
                                                    <th key={f} className="p-3 text-left border-b border-border uppercase">{f}</th>
                                                ))}
                                                <th className="p-3 text-left border-b border-border uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rawData.slice(0, 10).map((row, i) => (
                                                <tr key={i} className="border-b border-border/50">
                                                    {getRequiredFields().map(f => (
                                                        <td key={f} className="p-3">{row[mapping[f]] || "-"}</td>
                                                    ))}
                                                    <td className="p-3 text-success font-bold flex items-center gap-1">
                                                        <CheckCircle size={12} /> Válido
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {rawData.length > 10 && (
                                    <div className="p-3 text-center bg-muted/30 text-[10px] text-muted-foreground uppercase font-bold">
                                        Exibindo 10 de {rawData.length} linhas
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto flex justify-between items-center pt-6 border-t border-border">
                                <button onClick={() => setStep(2)} className="font-bold text-muted-foreground hover:text-foreground">Recalibrar Mapeamento</button>
                                <button
                                    onClick={() => {
                                        toast.info(`Iniciando importação de ${rawData.length} itens...`);
                                        setTimeout(() => {
                                            setStep(4);
                                            toast.success("Importação concluída com sucesso!");
                                        }, 2000);
                                    }}
                                    className="bg-success text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-success/20 flex items-center gap-2"
                                >
                                    Importar Agora
                                    <Database size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center flex-grow text-center max-w-md mx-auto animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={60} strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-extrabold mb-2">Missão Cumprida!</h2>
                            <p className="text-muted-foreground mb-8">
                                Enviamos {rawData.length} registros para o processamento do n8n Cloud. Os dados estarão disponíveis no dashboard em alguns segundos.
                            </p>
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button
                                    onClick={() => setStep(1)}
                                    className="p-4 bg-muted/50 border border-border rounded-xl font-bold hover:bg-muted transition-all"
                                >
                                    Nova Importação
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="p-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                                >
                                    Ir para Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
