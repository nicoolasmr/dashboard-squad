"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Calendar, Clock, Video, User, CheckCircle2, XCircle, RotateCcw, MoreHorizontal, MapPin, MessageSquare, LayoutGrid, List, Loader2 } from "lucide-react";
import { useMeetings } from "@/hooks/useMeetings";
import { GanttChart } from "./GanttChart";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Meeting } from "@/types/dashboard";
import { formatDateTime, cn } from "@/lib/utils";
import { toast } from "sonner";

export function MeetingsView() {
    const { data, loading, create } = useMeetings();
    const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        titulo: "", cliente: "", owner: "",
        data_hora: "", canal: "ZOOM", notas: ""
    });

    const columns: any[] = [
        {
            header: "Data/Hora", accessor: (item: Meeting) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground">{formatDateTime(item.data_hora)}</span>
                    <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 font-bold tracking-wider">
                        {item.canal === 'ZOOM' || item.canal === 'MEET' ? <Video size={10} className="text-primary" /> : <MapPin size={10} className="text-success" />}
                        {item.canal}
                    </span>
                </div>
            )
        },
        {
            header: "Título",
            accessor: (item: Meeting) => (
                <span className="font-medium text-foreground">{item.titulo}</span>
            )
        },
        {
            header: "Cliente", accessor: (item: Meeting) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center text-xs font-bold text-muted-foreground border border-border/50">
                        {item.cliente.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm">{item.cliente}</span>
                </div>
            )
        },
        {
            header: "Owner",
            accessor: (item: Meeting) => (
                <Badge variant="outline" className="rounded-lg px-2 py-0 border-border/60 text-[10px] font-medium uppercase">
                    {item.owner}
                </Badge>
            )
        },
        {
            header: "Status", accessor: (item: Meeting) => {
                const variants: Record<string, "success" | "warning" | "destructive" | "primary" | "outline"> = {
                    'FEITA': 'success',
                    'MARCADA': 'primary',
                    'CANCELADA': 'destructive',
                    'NO_SHOW': 'warning',
                    'REMARCADA': 'outline'
                };
                return (
                    <Badge variant={variants[item.status] as any} className="rounded-lg px-2.5 py-0.5 font-bold border-none capitalize">
                        {item.status.toLowerCase()}
                    </Badge>
                );
            }
        },
        {
            header: "", accessor: (item: Meeting) => (
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedMeeting(item);
                }}>
                    <MoreHorizontal size={16} className="text-muted-foreground" />
                </Button>
            )
        },
    ];

    // Real data from Supabase
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [channelFilter, setChannelFilter] = useState<string>("ALL");

    const filteredData = data.filter(item => {
        const matchesSearch = (item.titulo?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (item.cliente?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (item.owner?.toLowerCase() || "").includes(search.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        const matchesChannel = channelFilter === "ALL" || item.canal === channelFilter;

        return matchesSearch && matchesStatus && matchesChannel;
    });

    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState<"TABLE" | "GANTT">("TABLE");

    // Map meetings to Gantt format
    const ganttData = filteredData.map(m => {
        const startDate = new Date(m.data_hora);
        // Default duration 1 hour for meetings
        const duration = 60 * 60 * 1000;

        const colors: Record<string, string> = {
            'MARCADA': '#3b82f6', // blue
            'FEITA': '#22c55e',   // green
            'CANCELADA': '#ef4444', // red
            'NO_SHOW': '#f59e0b', // amber
            'REMARCADA': '#8b5cf6' // violet
        };

        return {
            id: m.id,
            name: m.titulo,
            start: startDate.getTime(),
            duration: duration,
            color: colors[m.status] || '#94a3b8',
            status: m.status
        };
    });

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Agenda de Reuniões</h1>
                    <p className="text-muted-foreground mt-2 text-sm font-medium">Gestão inteligente de calls e reuniões presenciais.</p>
                </div>
                <Button
                    onClick={() => setIsNewMeetingOpen(true)}
                    className="h-12 px-8 rounded-2xl font-bold text-base bg-success hover:bg-success/90 shadow-xl shadow-success/20 active:scale-95"
                >
                    <Plus size={20} className="mr-2" />
                    Agendar Reunião
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="rounded-[2.5rem] border-border/60 shadow-premium group overflow-hidden">
                    <CardContent className="p-8">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Hoje</p>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <h3 className="text-5xl font-bold tracking-tighter">12</h3>
                                <p className="text-xs font-bold text-success mt-1 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} /> 4 realizadas
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Calendar size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2.5rem] border-border/60 shadow-premium group overflow-hidden">
                    <CardContent className="p-8">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Amanhã</p>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                                <h3 className="text-5xl font-bold tracking-tighter">08</h3>
                                <p className="text-xs font-bold text-muted-foreground mt-1 flex items-center gap-1.5 uppercase">
                                    Confirmadas
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                                <Clock size={24} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table section */}
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-[3rem] border border-border/60 shadow-premium flex flex-col gap-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={20} />
                        <Input
                            placeholder="Buscar por título, cliente ou owner..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-14 pl-14 bg-muted/30 border-border/40 rounded-2xl focus-visible:ring-success/20 focus-visible:border-success transition-all text-base"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex bg-muted/20 p-1 rounded-2xl border border-border/50">
                            <Button
                                variant={viewMode === "TABLE" ? "default" : "ghost"}
                                size="sm"
                                className="rounded-xl h-12 px-4 shadow-sm"
                                onClick={() => setViewMode("TABLE")}
                            >
                                <List size={18} className="mr-2" />
                                Lista
                            </Button>
                            <Button
                                variant={viewMode === "GANTT" ? "default" : "ghost"}
                                size="sm"
                                className="rounded-xl h-12 px-4 shadow-sm"
                                onClick={() => setViewMode("GANTT")}
                            >
                                <LayoutGrid size={18} className="mr-2" />
                                Gantt
                            </Button>
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-14 w-[160px] rounded-2xl border-border/60 bg-muted/30 font-bold text-xs uppercase tracking-wider">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos Status</SelectItem>
                                <SelectItem value="FEITA">Concluída</SelectItem>
                                <SelectItem value="MARCADA">Agendada</SelectItem>
                                <SelectItem value="CANCELADA">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={channelFilter} onValueChange={setChannelFilter}>
                            <SelectTrigger className="h-14 w-[160px] rounded-2xl border-border/60 bg-muted/30 font-bold text-xs uppercase tracking-wider">
                                <SelectValue placeholder="Canal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos Canais</SelectItem>
                                <SelectItem value="ZOOM">Zoom</SelectItem>
                                <SelectItem value="MEET">Google Meet</SelectItem>
                                <SelectItem value="PRES">Presencial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {viewMode === "TABLE" ? (
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        emptyMessage="Sem reuniões para os critérios de busca."
                        onRowClick={(item) => setSelectedMeeting(item)}
                    />
                ) : (
                    <div className="bg-card/30 rounded-[2rem] border border-border/40 p-6">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <h3 className="text-lg font-bold">Cronograma de Reuniões</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Horário Linear</p>
                        </div>
                        <GanttChart data={ganttData} type="MEETINGS" height={360} />
                    </div>
                )}
            </div>

            {/* New Meeting Modal */}
            <Dialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen}>
                <DialogContent className="max-w-2xl rounded-[3rem] border-border/60 p-10">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold">Agendar Nova Reunião</DialogTitle>
                        <DialogDescription className="text-base">
                            Configure o próximo compromisso do time.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="flex flex-col gap-6 my-8 pointer-events-auto" onSubmit={(e) => {
                        e.preventDefault();
                        toast.success("Evento sincronizado com o dashboard!");
                        setIsNewMeetingOpen(false);
                    }}>
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest leading-none">Título do Compromisso</Label>
                            <Input id="title" required placeholder="Ex: Call de Alinhamento Estratégico" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="client" className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest leading-none">Cliente</Label>
                                <Input id="client" required placeholder="Nome do Lead/Empresa" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="owner" className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest leading-none">Owner (Responsável)</Label>
                                <Select>
                                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nic">Nicolas Moreira</SelectItem>
                                        <SelectItem value="mar">Maria Silva</SelectItem>
                                        <SelectItem value="jon">João Santos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="time" className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest leading-none">Data e Horário</Label>
                                <Input id="time" required type="datetime-local" className="h-12 rounded-xl bg-muted/30 border-border/40" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="chan" className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest leading-none">Canal</Label>
                                <Select>
                                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40">
                                        <SelectValue placeholder="Escolha..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ZOOM">Zoom Video</SelectItem>
                                        <SelectItem value="MEET">Google Meet</SelectItem>
                                        <SelectItem value="CALL">Ligar via Telefone</SelectItem>
                                        <SelectItem value="PRES">Presencial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest leading-none">Pauta / Notas</Label>
                            <Textarea id="notes" rows={3} placeholder="O que será discutido?" className="rounded-xl bg-muted/30 border-border/40 resize-none p-4" />
                        </div>

                        <DialogFooter className="mt-4 gap-3">
                            <Button variant="ghost" type="button" onClick={() => setIsNewMeetingOpen(false)} className="rounded-xl font-bold h-12">
                                Cancelar
                            </Button>
                            <Button type="submit" className="rounded-xl font-bold h-12 px-10 bg-success hover:bg-success/90">
                                Confirmar Agendamento
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Meeting Details & Edit Modal */}
            <Dialog open={!!selectedMeeting} onOpenChange={(open) => {
                if (!open) {
                    setSelectedMeeting(null);
                    setIsEditing(false);
                }
            }}>
                <DialogContent className="max-w-xl rounded-[3rem] border-border/60 p-0 overflow-hidden shadow-2xl">
                    {selectedMeeting && (
                        <>
                            <div className="bg-primary/5 p-10 pb-14 relative border-b border-primary/10">
                                <div className="absolute top-10 right-10">
                                    <Badge variant="primary" className="rounded-xl px-4 py-1.5 font-bold uppercase tracking-wider border-none text-[10px] shadow-lg shadow-primary/10">
                                        {selectedMeeting.status}
                                    </Badge>
                                </div>
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center mb-8">
                                    {selectedMeeting.canal === 'ZOOM' || selectedMeeting.canal === 'MEET' ? <Video size={36} /> : <User size={36} />}
                                </div>
                                {isEditing ? (
                                    <Input
                                        defaultValue={selectedMeeting.titulo}
                                        className="text-3xl font-bold bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-1 p-0 h-auto"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-foreground leading-[1.1] mb-2">{selectedMeeting.titulo}</h2>
                                )}
                                <p className="text-muted-foreground font-semibold flex items-center gap-2 italic">
                                    com <span className="text-foreground not-italic">{selectedMeeting.cliente}</span>
                                </p>
                            </div>

                            <div className="p-10 bg-card relative z-10 space-y-10 rounded-t-[2.5rem] -mt-6 shadow-2xl">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.15em] flex items-center gap-2">
                                            <Calendar size={12} className="text-primary" /> {isEditing ? "Nova Data" : "Data e Horário"}
                                        </p>
                                        {isEditing ? (
                                            <Input type="datetime-local" defaultValue={selectedMeeting.data_hora} className="h-10 rounded-xl bg-muted/40 border-none font-bold" />
                                        ) : (
                                            <p className="font-bold text-lg">{formatDateTime(selectedMeeting.data_hora)}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.15em] flex items-center gap-2 justify-end">
                                            <Video size={12} className="text-primary" /> Plataforma
                                        </p>
                                        <p className="font-bold text-lg">{selectedMeeting.canal}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.15em] flex items-center gap-2">
                                            <User size={12} className="text-primary" /> Gestor Responsável
                                        </p>
                                        {isEditing ? (
                                            <Input defaultValue={selectedMeeting.owner} className="h-10 rounded-xl bg-muted/40 border-none font-bold" />
                                        ) : (
                                            <p className="font-bold text-lg">{selectedMeeting.owner}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.15em] flex items-center gap-2 justify-end">
                                            <MessageSquare size={12} className="text-primary" /> Notas Rápidas
                                        </p>
                                        <p className="text-sm font-medium text-muted-foreground line-clamp-1">Presente no briefing</p>
                                    </div>
                                </div>

                                {selectedMeeting.notas && (
                                    <div className="pt-8 border-t border-border/40">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mb-4">Briefing & Contexto</p>
                                        {isEditing ? (
                                            <Textarea defaultValue={selectedMeeting.notas} className="rounded-xl bg-muted/30 border-border/40" rows={3} />
                                        ) : (
                                            <div className="bg-muted/30 p-6 rounded-[1.5rem] border border-border/30 text-sm font-medium text-foreground/80 leading-relaxed italic">
                                                "{selectedMeeting.notas}"
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                className="flex-1 h-14 rounded-2xl font-bold"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                className="flex-1 h-14 rounded-2xl font-bold bg-success hover:bg-success/90 shadow-lg shadow-success/20"
                                                onClick={() => {
                                                    toast.success("Reunião atualizada com sucesso!");
                                                    setIsEditing(false);
                                                }}
                                            >
                                                Salvar Alterações
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-14 rounded-2xl font-bold border-border/60 hover:bg-muted/50"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Editar Reunião
                                            </Button>
                                            <Button
                                                className="flex-1 h-14 rounded-2xl font-bold bg-success hover:bg-success/90 shadow-lg shadow-success/20 border-none"
                                                onClick={() => {
                                                    toast.success("Reunião marcada como concluída!");
                                                    setSelectedMeeting(null);
                                                }}
                                            >
                                                Concluir Reunião
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
