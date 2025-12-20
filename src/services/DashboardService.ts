import { http } from "@/lib/http";

export interface InversorStatsDTO {
    valorTotal: number;
    rendimientoDiario: number;
    cantidadActivos: number;
    exposicionCripto: number;
}

export interface ExpertoStatsDTO {
    totalRecomendaciones: number;
    recomendacionesActivas: number;
    tasaAcierto?: number;
    ranking?: number;
}

export interface AdminStatsDTO {
    totalUsuarios: number;
    nuevosUsuariosMes: number;
    totalActivos: number;
    recomendacionesPendientes?: number;
}

export async function getInversorStats(): Promise<InversorStatsDTO> {
    const { data } = await http.get<InversorStatsDTO>("/api/dashboard/inversor/stats");
    return data;
}

export async function getExpertoStats(): Promise<ExpertoStatsDTO> {
    const { data } = await http.get<ExpertoStatsDTO>("/api/dashboard/experto/stats");
    return data;
}

export async function getAdminStats(): Promise<AdminStatsDTO> {
    const { data } = await http.get<AdminStatsDTO>("/api/dashboard/admin/stats");
    return data;
}
