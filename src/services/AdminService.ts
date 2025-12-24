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

export const getUsers = async (): Promise<UserDTO[]> => {
    // Correct endpoint from docs: /api/personas
    try {
        const { data } = await http.get<UserDTO[]>('/api/personas');
        return data;
    } catch (e) {
        console.warn("Error fetching users, falling back to empty list", e);
        return [];
    }
};

export const getAllOperations = async (): Promise<OperacionResponseDTO[]> => {
    // Correct endpoint from docs: /api/operaciones
    const { data } = await http.get<OperacionResponseDTO[]>('/api/operaciones');
    return data;
};
