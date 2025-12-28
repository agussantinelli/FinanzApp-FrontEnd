import { http } from "@/lib/http";
import { CrearRecomendacionDTO, RecomendacionDTO, RecomendacionResumenDTO } from "@/types/Recomendacion";

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

export const destacarRecomendacion = async (id: string): Promise<void> => {
    await http.patch(`${ENDPOINT}/${id}/destacar`);
};

export const resolverRecomendacion = async (id: string, esAcertada: boolean): Promise<void> => {
    await http.patch(`${ENDPOINT}/${id}/resolucion`, { esAcertada });
};


export const getRecomendacionesAdmin = async (estado?: number): Promise<RecomendacionResumenDTO[]> => {
    const params: any = {};
    if (estado !== undefined) params.estado = estado;

    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/admin/filtro`, { params });
    return data;
};

export const getFiltradasAdmin = async (estado?: number): Promise<RecomendacionResumenDTO[]> => {
    const params: any = {};
    if (estado !== undefined) params.estado = estado;

    // Using the same endpoint as getRecomendacionesAdmin but naming it explicitly as requested
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/admin/filtro`, { params });
    return data;
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

export const getRecomendacionesEnCursoByAutor = async (personaId: string): Promise<RecomendacionResumenDTO[]> => {
    const { data } = await http.get<RecomendacionResumenDTO[]>(`${ENDPOINT}/autor/${personaId}/en-curso`);
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

export const updateRecomendacion = async (id: string, dto: CrearRecomendacionDTO): Promise<RecomendacionResumenDTO> => {
    const { data } = await http.put<RecomendacionResumenDTO>(`${ENDPOINT}/${id}`, dto);
    return data;
};

