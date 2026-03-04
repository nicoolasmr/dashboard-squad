"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
    title: string;
    value: number;
    type: "currency" | "number";
    trend?: number;
    icon: React.ReactNode;
    loading?: boolean;
    onClick?: () => void;
}

export function KPICard({ title, value, type, trend, icon, loading, onClick }: KPICardProps) {
    const formattedValue = type === "currency" ? formatCurrency(value) : value.toString();

    return (
        <Card
            className={cn(
                "rounded-3xl border-border shadow-premium hover:shadow-lg transition-all duration-300 group overflow-hidden",
                onClick && "cursor-pointer hover:border-primary/30"
            )}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                        {icon}
                    </div>
                    {trend !== undefined && (
                        <div className={cn(
                            "flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-xl",
                            trend >= 0 ? "text-success bg-success/10" : "text-error bg-error/10"
                        )}>
                            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
                    {loading ? (
                        <div className="h-9 w-32 bg-muted animate-pulse rounded-lg" />
                    ) : (
                        <h3 className="text-3xl font-bold tracking-tight">{formattedValue}</h3>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
