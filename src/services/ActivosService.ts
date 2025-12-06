import { http } from "./Http";
import { ActivoDTO } from "@/types/Activo";

export async function getActivos(tipo?: string): Promise<ActivoDTO[]> {
    const params = tipo && tipo !== "Todos" ? { tipo } : {};
    const res = await http.get<ActivoDTO[]>("/api/activos", { params });
    return res.data;
}

export async function getActivoById(id: string): Promise<ActivoDTO> {
    const res = await http.get<ActivoDTO>(`/api/activos/${id}`);
    return res.data;
}

export async function getActivosByTipoId(id: number): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/tipo/${id}`);
    return res.data;
}

export async function getActivosNoMoneda(): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>("/api/activos/no-moneda");
    return res.data;
}

export async function getRankingActivos(criterio: string = "variacion", desc: boolean = true, tipoId?: number): Promise<ActivoDTO[]> {
    const params: any = { criterio, desc };
    if (tipoId) params.tipoId = tipoId;

    const res = await http.get<ActivoDTO[]>("/api/activos/ranking", { params });
    return res.data;
}

export async function searchActivos(texto: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/buscar/${texto}`);
    return res.data;
}

export async function getActivosBySector(sectorId: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/filtrar/sector/${sectorId}`);
    return res.data;
}

export async function getActivosByTipoAndSector(tipoId: number, sectorId: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/filtrar/tipo/${tipoId}/sector/${sectorId}`);
    return res.data;
}
