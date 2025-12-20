import { http } from "@/lib/http";
import { InversorStatsDTO, ExpertoStatsDTO, AdminStatsDTO } from "@/types/Dashboard";

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
