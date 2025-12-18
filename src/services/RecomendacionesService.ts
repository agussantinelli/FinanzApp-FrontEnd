import { http } from "@/lib/http";
import { CrearRecomendacionDTO, RecomendacionDTO } from "@/types/Recomendacion";

const ENDPOINT = "/api/recomendaciones";

export const getRecomendaciones = async (soloActivas: boolean = false): Promise<RecomendacionDTO[]> => {
    const params = soloActivas ? { soloActivas: true } : {};
    const { data } = await http.get<RecomendacionDTO[]>(ENDPOINT, { params });
    return data;
};

export const getRecomendacionById = async (id: string): Promise<RecomendacionDTO> => {
    const { data } = await http.get<RecomendacionDTO>(`${ENDPOINT}/${id}`);
    return data;
};

export const getRecomendacionesBySector = async (sectorId: string): Promise<RecomendacionDTO[]> => {
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/sector/${sectorId}`);
    return data;
};

export const getRecomendacionesByAutor = async (personaId: string): Promise<RecomendacionDTO[]> => {
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/autor/${personaId}`);
    return data;
};

export const getRecomendacionesByActivo = async (activoId: string): Promise<RecomendacionDTO[]> => {
    const { data } = await http.get<RecomendacionDTO[]>(`${ENDPOINT}/activo/${activoId}`);
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
