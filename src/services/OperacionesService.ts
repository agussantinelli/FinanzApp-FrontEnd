import { http } from "@/lib/http";

const ENDPOINT = "/api/operaciones";

export interface OperacionDTO {
    id: string;
    activoId: string;
    personaId: string;
    tipo: 'Compra' | 'Venta';
    cantidad: number;
    precio: number;
    fechaOperacion: string;
    activo?: {
        symbol: string;
        nombre: string;
    };
}

export interface CrearOperacionDTO {
    activoId: string;
    cantidad: number;
    tipo: 'Compra' | 'Venta';
}

export const getOperaciones = async (): Promise<OperacionDTO[]> => {
    const { data } = await http.get<OperacionDTO[]>(ENDPOINT);
    return data;
};

export const getOperacionesByPersona = async (personaId: string): Promise<OperacionDTO[]> => {
    const { data } = await http.get<OperacionDTO[]>(`${ENDPOINT}/persona/${personaId}`);
    return data;
};

export const getOperacionesByActivo = async (activoId: string): Promise<OperacionDTO[]> => {
    const { data } = await http.get<OperacionDTO[]>(`${ENDPOINT}/activo/${activoId}`);
    return data;
};

export const createOperacion = async (dto: CrearOperacionDTO): Promise<OperacionDTO> => {
    const { data } = await http.post<OperacionDTO>(ENDPOINT, dto);
    return data;
};
