import { http } from "@/lib/http";
import { CrearRecomendacionDTO, RecomendacionDTO, RecomendacionResumenDTO } from "@/types/Recomendacion";

const ENDPOINT = "/api/recomendaciones";

// Cache simple en memoria
// import { cacheRecomendaciones } from "@/lib/recomendaciones-cache"; // Disabled for now due to type mismatch

// Admin
export const aprobarRecomendacion = async (id: string): Promise<void> => {
    await http.patch(`${ENDPOINT}/${id}/aceptar`);
};

export const rechazarRecomendacion = async (id: string): Promise<void> => {
    await http.patch(`${ENDPOINT}/${id}/rechazar`);
};

export const deleteRecomendacion = async (id: string): Promise<void> => {
    await http.delete(`${ENDPOINT}/${id}`);
};

// Usuario Logueado
export const getRecomendaciones = async (soloActivas: boolean = true): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(ENDPOINT, {
        params: { soloActivas }
    });
    return data;
};

export const getRecomendacionById = async (id: string): Promise<RecomendacionDTO> => {
    const { data } = await http.get<RecomendacionDTO>(`${ENDPOINT}/${id}`);
    return data;
};

export const getRecomendacionesBySector = async (sectorId: string, soloActivas: boolean = true): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/sector/${sectorId}`, { params: { soloActivas } });
    return data;
};

export const getRecomendacionesByAutor = async (personaId: string, soloActivas: boolean = true): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/autor/${personaId}`, { params: { soloActivas } });
    return data;
};

export const getRecomendacionesByActivo = async (activoId: string, soloActivas: boolean = true): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/activo/${activoId}`, { params: { soloActivas } });
    return data;
};

export const getRecomendacionesByHorizonte = async (horizonte: number, soloActivas: boolean = true): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/horizonte/${horizonte}`, { params: { soloActivas } });
    return data;
};

export const getRecomendacionesByRiesgo = async (riesgo: number, soloActivas: boolean = true): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/riesgo/${riesgo}`, { params: { soloActivas } });
    return data;
};

export const getRecomendacionesRecientes = async (): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/recientes-semana`);
    return data;
};

export const createRecomendacion = async (dto: CrearRecomendacionDTO): Promise<RecomendacionResumenDTO> => {
    const { data } = await http.post<RecomendacionResumenDTO>(ENDPOINT, dto);
    return data;
};
