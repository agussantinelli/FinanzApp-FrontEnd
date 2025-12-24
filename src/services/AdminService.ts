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

export const updateUser = async (id: string, data: UserDTO, newRole: string): Promise<void> => {
    // Map UserDTO to UserUpdateRequest
    // Note: This assumes the backend endpoint is PUT /api/personas/{id} and accepts PersonaUpdateDTO
    // We need to carefully map fields.
    const updateRequest = {
        nombre: data.nombre,
        apellido: data.apellido,
        fechaNac: data.fechaNacimiento, // UserDTO has fechaNacimiento, DTO expects fechaNac
        rol: newRole,
        esResidenteArgentina: data.esResidenteArgentina,
        localidadResidenciaId: data.localidadResidenciaId || null,
        paisResidenciaId: data.paisResidenciaId || 0, // Fallback if required
        paisNacionalidadId: data.nacionalidadId
    };

    await http.put(`/api/personas/${id}`, updateRequest);
};

export const promoteToExperto = async (id: string): Promise<void> => {
    await http.patch(`/api/personas/${id}/rol/experto`, {});
};

export const demoteToInversor = async (id: string): Promise<void> => {
    await http.patch(`/api/personas/${id}/rol/inversor`, {});
};
