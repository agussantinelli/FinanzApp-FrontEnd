import { OperacionResponseDTO } from "@/types/Operacion";
import { UserDTO } from "@/types/Usuario";
import { AdminStatsDTO, AdminPortfolioStatsDTO } from "@/types/Admin";
import { http } from "@/lib/http";

export const getDashboardStats = async (): Promise<AdminStatsDTO> => {
    const { data } = await http.get<AdminStatsDTO>('/api/dashboard/admin/stats');
    return data;
};

export const getAdminPortfolioStats = async (): Promise<AdminPortfolioStatsDTO> => {
    const { data } = await http.get<AdminPortfolioStatsDTO>('/api/dashboard/admin/portafolios/stats');
    return data;
};

export const getAllOperations = async (): Promise<OperacionResponseDTO[]> => {

    const { data } = await http.get<OperacionResponseDTO[]>('/api/operaciones');
    return data;
};