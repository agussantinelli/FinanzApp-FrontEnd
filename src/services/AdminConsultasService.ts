import { http } from "@/lib/http";
import { OperacionDetalleDTO } from "@/types/AdminConsultas";
import { PortafolioDTO } from "@/types/Portafolio"; // Assuming Admin reuses this or basic DTO

const ENDPOINT = "/api/admin/consultas";

export interface OperacionFilter {
    activoId?: string;
    sectorId?: string;
    personaId?: string;
    rol?: string;
    soloHoy?: boolean;
}

export async function getOperacionesAdmin(filters: OperacionFilter): Promise<OperacionDetalleDTO[]> {
    const { data } = await http.get<OperacionDetalleDTO[]>(`${ENDPOINT}/operaciones`, { params: filters });
    return data;
}

export async function getOperacionesDeHoy(): Promise<OperacionDetalleDTO[]> {
    const { data } = await http.get<OperacionDetalleDTO[]>(`${ENDPOINT}/operaciones/hoy`);
    return data;
}

export async function getPortafoliosAdmin(filters: { usuarioId?: string, rol?: string }): Promise<PortafolioDTO[]> {
    const { data } = await http.get<PortafolioDTO[]>(`${ENDPOINT}/portafolios`, { params: filters });
    return data;
}
