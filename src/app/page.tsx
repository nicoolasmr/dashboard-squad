"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/lib/supabase";
import { DashboardData, Transaction, Meeting } from "@/types/dashboard";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

// Sub-components
import { DashboardView } from "@/components/dashboard/DashboardView";
import { SalesView } from "@/components/dashboard/SalesView";
import { FinanceView } from "@/components/dashboard/FinanceView";
import { MeetingsView } from "@/components/dashboard/MeetingsView";
import { ImportView } from "@/components/import/ImportTool";
import { ModoTV } from "@/components/tv/ModoTV";
import { ConnectionSettings } from "@/components/layout/ConnectionSettings";
import { GoalsConfig } from "@/components/dashboard/GoalsConfig";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  // Sync state with URL when browser history changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "dashboard";
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isTVMode = searchParams.get("tv") === "1";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (isSimulationMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setData({
          kpis: { receita_aprovada: 125430.50, receita_total: 154000.00, despesas_total: 45000.20, custos_total: 12000.00, lucro: 68430.30, vendas_qtd: 142, pendentes_qtd: 28 },
          transactions: [
            { id: "1", data: "2026-03-03", tipo: "RECEITA", status: "APROVADO", valor: 1497.00, categoria: "Venda", subcategoria: "Produto", origem: "KIWIFY", nome: "Nicolas Moreira", email: "nicolas@exemplo.com", responsavel: "Vendas", descricao: "Premium Pack" },
            { id: "2", data: "2026-03-03", tipo: "RECEITA", status: "APROVADO", valor: 497.00, categoria: "Venda", subcategoria: "E-book", origem: "HOTMART", nome: "Maria Silva", email: "maria@exemplo.com", responsavel: "Vendas", descricao: "E-book Closing" },
            { id: "3", data: "2026-03-01", tipo: "DESPESA", status: "PAGO", valor: 2450.00, categoria: "TI", subcategoria: "Infra", origem: "MANUAL", responsavel: "TI", descricao: "AWS Mensal" }
          ],
          meetings: [
            { id: "m1", data_hora: "2026-03-04T14:00", titulo: "Briefing Squad", cliente: "Nicolas", owner: "Nicolas", status: "MARCADA", canal: "ZOOM", notas: "Alinhamento" }
          ]
        });
      } else {
        // Fetch real data from Supabase
        const [{ data: transactions }, { data: meetings }] = await Promise.all([
          supabase.from("transactions").select("*").is("deleted_at", null).order("data", { ascending: false }),
          supabase.from("meetings").select("*").is("deleted_at", null).order("data_hora", { ascending: false })
        ]);

        const txs = (transactions || []) as Transaction[];
        const mts = (meetings || []) as Meeting[];

        // Compute KPIs
        const receita_aprovada = txs.filter(t => t.tipo === 'RECEITA' && t.status === 'APROVADO').reduce((sum, t) => sum + Number(t.valor), 0);
        const receita_total = txs.filter(t => t.tipo === 'RECEITA').reduce((sum, t) => sum + Number(t.valor), 0);
        const despesas_total = txs.filter(t => t.tipo === 'DESPESA').reduce((sum, t) => sum + Number(t.valor), 0);
        const custos_total = txs.filter(t => t.tipo === 'CUSTO').reduce((sum, t) => sum + Number(t.valor), 0);
        const lucro = receita_aprovada - despesas_total - custos_total;
        const vendas_qtd = txs.filter(t => t.tipo === 'RECEITA' && t.status === 'APROVADO').length;
        const pendentes_qtd = txs.filter(t => t.tipo === 'RECEITA' && t.status === 'PENDENTE').length;

        setData({
          kpis: { receita_aprovada, receita_total, despesas_total, custos_total, lucro, vendas_qtd, pendentes_qtd },
          transactions: txs,
          meetings: mts
        });
      }
      setLastSync(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      toast.error("Erro ao sincronizar dados com Supabase.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isSimulationMode]);

  useEffect(() => {
    fetchData();

    if (isTVMode) {
      const interval = setInterval(fetchData, 60000);
      return () => clearInterval(interval);
    }
  }, [fetchData, isTVMode]);

  const handleNewSale = () => handleTabChange("sales");
  const handleNewExpense = () => handleTabChange("finance");
  const handleNewMeeting = () => handleTabChange("meetings");

  if (isTVMode) {
    return <ModoTV data={data} loading={loading} lastSync={lastSync} />;
  }


  return (
    <main className="min-h-screen bg-background transition-colors duration-500 pt-20 lg:pl-72">
      <Navbar
        activeTab={activeTab}
        onRefresh={fetchData}
        onNewSale={handleNewSale}
        onNewExpense={handleNewExpense}
        onNewMeeting={handleNewMeeting}
        onSettings={() => setIsSettingsOpen(true)}
        onConfigGoal={() => setIsGoalsOpen(true)}
      />

      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      <div className="p-6 lg:p-12 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-primary animate-in fade-in duration-700">
            <Loader2 size={48} className="animate-spin" strokeWidth={1} />
            <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">Decrypting Sync Stream...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {activeTab === "dashboard" && (
              <DashboardView
                data={data}
                loading={loading}
                isTVMode={isTVMode}
                lastSync={lastSync}
                onViewSales={() => handleTabChange("sales")}
                onViewMeetings={() => handleTabChange("meetings")}
                onViewFinance={() => handleTabChange("finance")}
              />
            )}
            {activeTab === "sales" && <SalesView />}
            {activeTab === "finance" && <FinanceView />}
            {activeTab === "meetings" && <MeetingsView />}
            {activeTab === "import" && <ImportView />}

            {/* Simulation Mode Indicator */}
            {isSimulationMode && activeTab === "dashboard" && (
              <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-10 duration-1000">
                <div className="bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl shadow-primary/40 flex items-center gap-4 border border-white/20 backdrop-blur-md">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Status do Ambiente</p>
                    <p className="text-sm font-bold">Modo Simulação Ativo</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase ml-2 border border-white/10"
                    onClick={() => {
                      setIsSimulationMode(false);
                      toast.info("Ambiente alternado para LIVE. Tentando conexão real...");
                    }}
                  >
                    Entrar em Produção
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ConnectionSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <GoalsConfig open={isGoalsOpen} onClose={() => setIsGoalsOpen(false)} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
