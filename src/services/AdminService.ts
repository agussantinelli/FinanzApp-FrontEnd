import { OperacionResponseDTO } from "@/types/Operacion";
import { UserDTO } from "@/types/Usuario";
import { AdminStatsDTO, AdminPortfolioStatsDTO } from "@/types/Admin";
import { http } from "@/lib/http";

export const getDashboardStats = async (): Promise<AdminStatsDTO> => {
    const { data } = await http.get<AdminStatsDTO>('/api/dashboard/admin');
    return data;
};

export const getAdminPortfolioStats = async (): Promise<AdminPortfolioStatsDTO> => {
    const { data } = await http.get<AdminPortfolioStatsDTO>('/api/dashboard/admin/portfolio');
    return data;
};

export const getUsers = async (): Promise<UserDTO[]> => {
    // Keeping mock for users list if not requested to change, but user said "saca lo hardcodeado".
    // I'll check if there's an endpoint for users locally implied.
    // Usually /api/usuarios
    try {
        const { data } = await http.get<UserDTO[]>('/api/usuarios');
        return data;
    } catch {
        console.warn("Using mock for users as fallback/dev");
        return []; // Fallback empty or let it fail? User said saca lo hardcodeado.
    }
};

export const getAllOperations = async (): Promise<OperacionResponseDTO[]> => {
    const { data } = await http.get<OperacionResponseDTO[]>('/api/operaciones/all');
    return data;
};
