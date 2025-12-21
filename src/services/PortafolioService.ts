import { http } from "@/lib/http";
import { PortafolioDTO, PortafolioValuadoDTO } from "@/types/Portafolio";

const ENDPOINT = "/api/portafolios";

export async function getMisPortafolios(): Promise<PortafolioDTO[]> {
    const { data } = await http.get<PortafolioDTO[]>(`${ENDPOINT}/mis-portafolios`);
    return data;
}

export async function getPortafolioValuado(id: string): Promise<PortafolioValuadoDTO> {
    const { data } = await http.get<PortafolioValuadoDTO>(`${ENDPOINT}/${id}/valuacion`);
    return data;
}
