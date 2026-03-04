"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/components/ui/Toast";
import { N8nService } from "@/lib/api/n8n";
import { DashboardData } from "@/types/dashboard";
import { useSearchParams } from "next/navigation";

// Sub-components
import { DashboardView } from "@/components/dashboard/DashboardView";
import { SalesView } from "@/components/dashboard/SalesView";
import { FinanceView } from "@/components/dashboard/FinanceView";
import { MeetingsView } from "@/components/dashboard/MeetingsView";
import { ImportView } from "@/components/import/ImportTool";
import { ModoTV } from "@/components/tv/ModoTV";
import { ConnectionSettings } from "@/components/layout/ConnectionSettings";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const searchParams = useSearchParams();
  const isTVMode = searchParams.get("tv") === "1";
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // In production, this would call n8n. Using mock/try-catch for now.
      const dashboardData = await N8nService.getDashboard();
      setData(dashboardData);
      setLastSync(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      toast("Não foi possível conectar ao n8n. Verifique suas configurações.", "error");

      // MOCK DATA for initial UI build
      setData({
        kpis: {
          receita_aprovada: 125430.50,
          receita_total: 154000.00,
          despesas_total: 45000.20,
          custos_total: 12000.00,
          lucro: 68430.30,
          vendas_qtd: 142,
          pendentes_qtd: 28
        },
        transactions: [],
        meetings: []
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();

    if (isTVMode) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchData, isTVMode]);

  const handleNewSale = () => setActiveTab("sales");
  const handleNewExpense = () => setActiveTab("finance");
  const handleNewMeeting = () => setActiveTab("meetings");

  return (
    <main className="min-h-screen pt-16 lg:pl-64">
      {!isTVMode && (
        <>
          <Navbar
            activeTab={activeTab}
            onRefresh={fetchData}
            onNewSale={handleNewSale}
            onNewExpense={handleNewExpense}
            onNewMeeting={handleNewMeeting}
            onSettings={() => setIsSettingsOpen(true)}
          />
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}

      <div className={isTVMode ? "p-0" : "p-6 lg:p-10"}>
        {activeTab === "dashboard" && <DashboardView data={data} loading={loading} isTVMode={isTVMode} lastSync={lastSync} />}
        {activeTab === "sales" && <SalesView />}
        {activeTab === "finance" && <FinanceView />}
        {activeTab === "meetings" && <MeetingsView />}
        {activeTab === "import" && <ImportView />}
      </div>

      <ConnectionSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </main>
  );
}
