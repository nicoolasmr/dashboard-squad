"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

export function DataTable<T>({ columns, data, loading, emptyMessage = "Nenhum dado encontrado.", onRowClick }: DataTableProps<T>) {
    return (
        <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-muted/30 border-b border-border">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={cn(
                                    "px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap",
                                    col.className
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, ridx) => (
                            <tr key={ridx} className="border-b border-border/50">
                                {columns.map((_, cidx) => (
                                    <td key={cidx} className="px-6 py-4">
                                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground italic">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, ridx) => (
                            <tr
                                key={ridx}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "border-b border-border/50 hover:bg-muted/20 transition-colors duration-150",
                                    onRowClick && "cursor-pointer"
                                )}
                            >
                                {columns.map((col, cidx) => (
                                    <td key={cidx} className={cn("px-6 py-4 text-sm", col.className)}>
                                        {typeof col.accessor === "function"
                                            ? col.accessor(item)
                                            : (item[col.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
