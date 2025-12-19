import { http } from "@/lib/http";
import { OperacionResponseDTO, CreateOperacionDTO } from "@/types/Operacion";

const ENDPOINT = "/api/operaciones";

export const getOperaciones = async (): Promise<OperacionResponseDTO[]> => {
    const { data } = await http.get<OperacionResponseDTO[]>(ENDPOINT);
    return data;
};

export const getOperacionesByPersona = async (personaId: string): Promise<OperacionResponseDTO[]> => {
    const { data } = await http.get<OperacionResponseDTO[]>(`${ENDPOINT}/persona/${personaId}`);
    return data;
};

export const getOperacionesByActivo = async (activoId: string): Promise<OperacionResponseDTO[]> => {
    const { data } = await http.get<OperacionResponseDTO[]>(`${ENDPOINT}/activo/${activoId}`);
    return data;
};

export const createOperacion = async (dto: CreateOperacionDTO): Promise<OperacionResponseDTO> => {
    const { data } = await http.post<OperacionResponseDTO>(ENDPOINT, dto);
    return data;
};
