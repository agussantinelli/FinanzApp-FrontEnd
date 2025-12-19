import { http } from "@/lib/http";
import { CrearRecomendacionDTO, RecomendacionDTO } from "@/types/Recomendacion";

const ENDPOINT = "/api/recomendaciones";

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
export const getRecomendaciones = async (soloActivas: boolean = false): Promise<RecomendacionDTO[]> => {
    const params = soloActivas ? { soloActivas: true } : {};
    const { data } = await http.get<RecomendacionDTO[]>(ENDPOINT, { params });
    return data;
};

export const getRecomendacionById = async (id: string): Promise<RecomendacionDTO> => {
    const { data } = await http.get<RecomendacionDTO>(`${ENDPOINT}/${id}`);
    return data;
};

export const getRecomendacionesBySector = async (sectorId: string, soloActivas: boolean = true): Promise<RecomendacionDTO[]> => {
    const params = soloActivas ? { soloActivas: true } : {};
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/sector/${sectorId}`, { params });
    return data;
};

export const getRecomendacionesByAutor = async (personaId: string, soloActivas: boolean = true): Promise<RecomendacionDTO[]> => {
    const params = soloActivas ? { soloActivas: true } : {};
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/autor/${personaId}`, { params });
    return data;
};

export const getRecomendacionesByActivo = async (activoId: string, soloActivas: boolean = true): Promise<RecomendacionDTO[]> => {
    const params = soloActivas ? { soloActivas: true } : {};
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/activo/${activoId}`, { params });
    return data;
};

export const getRecomendacionesByHorizonte = async (horizonte: number, soloActivas: boolean = true): Promise<RecomendacionDTO[]> => {
    const params = soloActivas ? { soloActivas: true } : {};
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/horizonte/${horizonte}`, { params });
    return data;
};

export const getRecomendacionesByRiesgo = async (riesgo: number, soloActivas: boolean = true): Promise<RecomendacionDTO[]> => {
    const params = soloActivas ? { soloActivas: true } : {};
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/riesgo/${riesgo}`, { params });
    return data;
};

export const getRecomendacionesRecientes = async (): Promise<RecomendacionDTO[]> => {
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/recientes-semana`);
    return data;
};

export const createRecomendacion = async (dto: CrearRecomendacionDTO): Promise<RecomendacionDTO> => {
    const { data } = await http.post<RecomendacionDTO>(ENDPOINT, dto);
    return data;
};
