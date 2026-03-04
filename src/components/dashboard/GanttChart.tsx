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
    LabelList
} from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GanttTask {
    id: string;
    name: string;
    start: number; // timestamp
    duration: number; // in milliseconds or days, depending on scale
    color: string;
    status: string;
    value?: string;
}

interface GanttChartProps {
    data: GanttTask[];
    height?: number;
    type: "SALES" | "FINANCE" | "MEETINGS";
}

export function GanttChart({ data, height = 400, type }: GanttChartProps) {
    // Sort data by start date
    const sortedData = [...data].sort((a, b) => a.start - b.start);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const task = payload[0].payload;
            return (
                <div className="bg-popover border border-border p-4 rounded-xl shadow-xl backdrop-blur-md">
                    <p className="font-bold text-foreground mb-1">{task.name}</p>
                    <div className="space-y-1 text-xs">
                        <p className="text-muted-foreground">
                            Início: <span className="text-foreground">{format(new Date(task.start), 'dd MMM, HH:mm', { locale: ptBR })}</span>
                        </p>
                        <p className="text-muted-foreground">
                            Status: <span className="font-bold uppercase tracking-wider" style={{ color: task.color }}>{task.status}</span>
                        </p>
                        {task.value && (
                            <p className="text-muted-foreground font-bold">
                                Valor: <span className="text-foreground">{task.value}</span>
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full min-h-[400px] py-4"
        >
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 20, right: 40, left: 100, bottom: 20 }}
                    barSize={32}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        hide
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={90}
                        tick={{ fontSize: 10, fontWeight: 'bold', fill: 'currentColor' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />

                    {/* Filler bar - invisible to create the "start" offset */}
                    <Bar dataKey="start" stackId="a" fill="transparent" />

                    {/* Actual task duration bar */}
                    <Bar dataKey="duration" stackId="a" radius={[0, 8, 8, 0]}>
                        {sortedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} stroke={entry.color} strokeWidth={2} />
                        ))}
                        <LabelList
                            dataKey="status"
                            position="right"
                            style={{ fontSize: '9px', fontWeight: 'bold', fill: 'currentColor', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '8px' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
