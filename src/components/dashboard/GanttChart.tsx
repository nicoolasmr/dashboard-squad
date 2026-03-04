"use client";

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface GanttTask {
    id: string;
    name: string;
    start: number; // unix timestamp ms
    duration: number; // ms
    color: string;
    status: string;
    value?: string;
}

interface GanttChartProps {
    data: GanttTask[];
    height?: number;
    type: "SALES" | "FINANCE" | "MEETINGS";
}

// Normalize raw timestamps into relative hours from earliest start
function normalize(data: GanttTask[]) {
    if (!data.length) return [];
    const minStart = Math.min(...data.map((d) => d.start));
    const hour = 1000 * 60 * 60;
    return data.map((d) => ({
        ...d,
        _offset: (d.start - minStart) / hour,          // hours from origin
        _duration: Math.max(d.duration / hour, 1),      // at least 1h bar
        _label: format(new Date(d.start), "dd/MM HH:mm", { locale: ptBR }),
    }));
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload as ReturnType<typeof normalize>[0] & { _label: string };
    if (!d) return null;
    return (
        <div className="bg-popover border border-border p-3 rounded-xl shadow-xl text-sm min-w-[180px]">
            <p className="font-bold text-foreground mb-1 truncate">{d.name}</p>
            <p className="text-muted-foreground">
                Data: <span className="text-foreground font-medium">{d._label}</span>
            </p>
            <p className="text-muted-foreground">
                Status:{" "}
                <span className="font-bold uppercase" style={{ color: d.color }}>
                    {d.status}
                </span>
            </p>
            {d.value && (
                <p className="text-muted-foreground mt-1">
                    Valor: <span className="text-foreground font-bold">{d.value}</span>
                </p>
            )}
        </div>
    );
};

// Truncate name to single line, max 18 chars
function truncateName(name: string, max = 18) {
    return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

export function GanttChart({ data, height = 380, type }: GanttChartProps) {
    const normalized = normalize(data);

    if (!normalized.length) {
        return (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Nenhum dado para exibir no Gantt.
            </div>
        );
    }

    const barSize = Math.max(24, Math.min(40, Math.floor(height / (normalized.length + 2))));

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
            style={{ height }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={normalized}
                    layout="vertical"
                    margin={{ top: 8, right: 100, left: 140, bottom: 8 }}
                    barSize={barSize}
                    barCategoryGap="30%"
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="rgba(120,120,120,0.12)"
                    />
                    <XAxis
                        type="number"
                        domain={[0, (dataMax: number) => Math.ceil(dataMax) + 2]}
                        tick={{ fontSize: 10, fill: "var(--muted-foreground, #888)" }}
                        tickFormatter={(v) => `+${Math.round(v)}h`}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={132}
                        tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor", textAnchor: "end", dx: -6 }}
                        tickFormatter={truncateName}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(120,120,120,0.06)" }} />

                    {/* Invisible offset bar to push the real bar to the right */}
                    <Bar dataKey="_offset" stackId="gantt" fill="transparent" />

                    {/* Visible duration bar */}
                    <Bar dataKey="_duration" stackId="gantt" radius={[0, 6, 6, 0]}>
                        {normalized.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Custom legend aligned right as status pills */}
            <div className="flex flex-wrap gap-2 justify-end mt-2 pr-2">
                {[...new Map(normalized.map((d) => [d.status, d.color])).entries()].map(
                    ([status, color]) => (
                        <span
                            key={status}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                            style={{ color, borderColor: color, background: `${color}15` }}
                        >
                            {status}
                        </span>
                    )
                )}
            </div>
        </motion.div>
    );
}
