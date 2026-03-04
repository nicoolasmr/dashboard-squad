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
import { format, differenceInCalendarDays } from "date-fns";
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

// Convert timestamps to day-based offsets for real calendar X-axis
function normalize(data: GanttTask[]) {
    if (!data.length) return { items: [], minStart: 0, maxEnd: 0, useHours: false };
    const minStart = Math.min(...data.map((d) => d.start));
    const maxEnd = Math.max(...data.map((d) => d.start + d.duration));
    const totalMs = maxEnd - minStart;
    const totalDays = totalMs / (1000 * 60 * 60 * 24);

    // If range < 3 days, fall back to hours for precision
    const useHours = totalDays < 3;
    const unit = useHours ? 1000 * 60 * 60 : 1000 * 60 * 60 * 24;
    const unitLabel = useHours ? "h" : "d";

    const items = data.map((d) => ({
        ...d,
        _offset: (d.start - minStart) / unit,
        _duration: Math.max(d.duration / unit, useHours ? 1 : 0.5),
        _startDate: new Date(d.start),
    }));

    return { items, minStart, maxEnd, useHours, unit, unitLabel };
}

// Tick formatter: show real date labels
function makeTickFormatter(minStart: number, useHours: boolean) {
    return (val: number) => {
        const ms = minStart + val * (useHours ? 3600000 : 86400000);
        const d = new Date(ms);
        if (useHours) return format(d, "HH'h'", { locale: ptBR });
        const diffDays = differenceInCalendarDays(new Date(), d);
        if (Math.abs(diffDays) > 60) return format(d, "MMM/yy", { locale: ptBR });
        return format(d, "dd/MM", { locale: ptBR });
    };
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
        <div className="bg-popover border border-border p-3 rounded-xl shadow-xl text-sm min-w-[180px]">
            <p className="font-bold text-foreground mb-1 truncate">{d.name}</p>
            <p className="text-muted-foreground">
                Data: <span className="text-foreground font-medium">
                    {format(d._startDate, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </span>
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

function truncateName(name: string, max = 18) {
    return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

export function GanttChart({ data, height = 380, type }: GanttChartProps) {
    const { items, minStart, useHours } = normalize(data);

    if (!items.length) {
        return (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Nenhum dado para exibir no Gantt.
            </div>
        );
    }

    const barSize = Math.max(24, Math.min(40, Math.floor(height / (items.length + 2))));
    const tickFormatter = makeTickFormatter(minStart, useHours ?? false);

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
                    data={items}
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
                        domain={[0, (dataMax: number) => Math.ceil(dataMax) + (useHours ? 2 : 1)]}
                        tick={{ fontSize: 10, fill: "var(--muted-foreground, #888)" }}
                        tickFormatter={tickFormatter}
                        axisLine={false}
                        tickLine={false}
                        tickCount={7}
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

                    {/* Invisible offset bar */}
                    <Bar dataKey="_offset" stackId="gantt" fill="transparent" />

                    {/* Visible duration bar */}
                    <Bar dataKey="_duration" stackId="gantt" radius={[0, 6, 6, 0]}>
                        {items.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Status legend */}
            <div className="flex flex-wrap gap-2 justify-end mt-2 pr-2">
                {[...new Map(items.map((d) => [d.status, d.color])).entries()].map(
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
