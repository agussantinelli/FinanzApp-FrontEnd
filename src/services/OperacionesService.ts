import { http } from "@/lib/http";
import { OperacionResponseDTO, CreateOperacionDTO, UpdateOperacionDTO } from "@/types/Operacion";

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
    const allOps = await getOperaciones();
    return allOps.filter(op => op.activoId?.toLowerCase() === activoId.toLowerCase());
};

export const createOperacion = async (dto: CreateOperacionDTO): Promise<OperacionResponseDTO> => {
    const { data } = await http.post<OperacionResponseDTO>(ENDPOINT, dto);
    return data;
};

export const updateOperacion = async (id: string, dto: UpdateOperacionDTO): Promise<OperacionResponseDTO> => {
    const { data } = await http.put<OperacionResponseDTO>(`${ENDPOINT}/${id}`, dto);
    return data;
};

export const deleteOperacion = async (id: string): Promise<void> => {
    await http.delete(`${ENDPOINT}/${id}`);
};

