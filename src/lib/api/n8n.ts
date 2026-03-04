import { DashboardData, Transaction, Meeting, ApiResponse, ImportResult } from "@/types/dashboard";

const DEFAULT_BASE_URL = "https://nicoolasmr.app.n8n.cloud";

export class N8nService {
    private static getStoredConfig() {
        if (typeof window === "undefined") return { baseUrl: DEFAULT_BASE_URL, token: "" };

        const baseUrl = localStorage.getItem("n8n_base_url") || DEFAULT_BASE_URL;
        const token = localStorage.getItem("n8n_token") || "";
        return { baseUrl, token };
    }

    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const { baseUrl, token } = this.getStoredConfig();

        const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

        const headers = new Headers(options.headers);
        if (token) {
            headers.set("X-DASH-TOKEN", token);
        }
        headers.set("Content-Type", "application/json");

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Request failed: ${response.statusText}`);
        }

        return response.json();
    }

    static async getDashboard(filters: any = {}): Promise<DashboardData> {
        // In a real app, filters would be query params
        const query = new URLSearchParams(filters).toString();
        return this.request<DashboardData>(`/webhook/api/dashboard${query ? `?${query}` : ""}`);
    }

    static async createTransaction(payload: Partial<Transaction>): Promise<{ ok: boolean; id: string }> {
        return this.request<{ ok: boolean; id: string }>("/webhook/api/transactions", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    static async updateTransaction(payload: { id: string; status: string; valor?: number }): Promise<{ ok: boolean }> {
        return this.request<{ ok: boolean }>("/webhook/api/transactions/update", {
            method: "PATCH", // Or POST depending on n8n config, but implementation plan said PATCH/POST
            body: JSON.stringify(payload),
        });
    }

    static async getMeetings(from?: string, to?: string): Promise<Meeting[]> {
        const query = new URLSearchParams();
        if (from) query.append("from", from);
        if (to) query.append("to", to);

        const queryString = query.toString();
        const endpoint = `/webhook/api/meetings${queryString ? `?${queryString}` : ""}`;

        const response = await this.request<any>(endpoint);
        // n8n might return the array directly or in a nested object
        return response.meetings || response;
    }

    static async createMeeting(payload: Partial<Meeting>): Promise<{ ok: boolean; id: string }> {
        return this.request<{ ok: boolean; id: string }>("/webhook/api/meetings", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    static async updateMeeting(payload: { id: string; status: string; notas?: string }): Promise<{ ok: boolean }> {
        return this.request<{ ok: boolean }>("/webhook/api/meetings/update", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    }

    static async importTransactions(payload: { source: string; rows: any[] }): Promise<ImportResult> {
        return this.request<ImportResult>("/webhook/api/import/transactions", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }
}
