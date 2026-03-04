"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "primary" | "success" | "warning" | "error" | "muted";
    className?: string;
}

export function Badge({ children, variant = "muted", className }: BadgeProps) {
    const variants = {
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        error: "bg-error/10 text-error border-error/20",
        muted: "bg-muted text-muted-foreground border-border",
    };

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
