import { http } from "@/lib/http";
import { PortafolioDTO, PortafolioValuadoDTO, PortafolioCreateDTO } from "@/types/Portafolio";

const ENDPOINT = "/api/portafolios";

export async function getMisPortafolios(): Promise<PortafolioDTO[]> {
    const { data } = await http.get<PortafolioDTO[]>(`${ENDPOINT}/mis-portafolios`);
    return data;
}

export async function getPortafolioValuado(id: string): Promise<PortafolioValuadoDTO> {
    const { data } = await http.get<PortafolioValuadoDTO>(`${ENDPOINT}/${id}/valuacion`);
    return data;
}

export async function updatePortafolio(id: string, nombre: string, descripcion: string): Promise<boolean> {
    await http.put(`${ENDPOINT}/${id}`, { nombre, descripcion });
    return true;
}

export async function toggleSeguirPortafolio(id: string): Promise<{ siguiendo: boolean, message: string }> {
    const { data } = await http.post<{ siguiendo: boolean, message: string }>(`${ENDPOINT}/${id}/seguir`);
    return data;
}

export async function createPortafolio(dto: PortafolioCreateDTO): Promise<PortafolioDTO> {
    const { data } = await http.post<PortafolioDTO>(ENDPOINT, dto);
    return data;
}

export async function getPortafolioById(id: string): Promise<PortafolioDTO> {
    const { data } = await http.get<PortafolioDTO>(`${ENDPOINT}/${id}`);
    return data;
}

export async function deletePortafolio(id: string): Promise<void> {
    await http.delete(`${ENDPOINT}/${id}`);
}

