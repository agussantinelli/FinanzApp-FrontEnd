import { http } from "@/lib/http";
import { ActivoDTO, ActivoCreateDTO, ActivoUpdateDTO } from "@/types/Activo";

import { cacheActivos } from "@/lib/activos-cache";

export async function createActivo(dto: ActivoCreateDTO): Promise<ActivoDTO> {
    const res = await http.post<ActivoDTO>("/api/activos", dto);
    cacheActivos([res.data]);
    return res.data;
}

export async function updateActivo(id: string, dto: ActivoUpdateDTO): Promise<ActivoDTO> {
    const res = await http.put<ActivoDTO>(`/api/activos/${id}`, dto);
    cacheActivos([res.data]);
    return res.data;
}

export async function deleteActivo(id: string): Promise<void> {

    await http.delete(`/api/activos/${id}`);
}

export async function getActivos(tipo?: string): Promise<ActivoDTO[]> {
    const params = tipo && tipo !== "Todos" ? { tipo } : {};
    const res = await http.get<ActivoDTO[]>("/api/activos", { params });
    cacheActivos(res.data, !tipo || tipo === "Todos");
    return res.data;
}

export async function getActivoById(id: string): Promise<ActivoDTO> {
    const res = await http.get<ActivoDTO>(`/api/activos/${id}`);
    return res.data;
}

export async function getActivoByTicker(symbol: string): Promise<ActivoDTO> {
    const res = await http.get<ActivoDTO>(`/api/activos/ticker/${symbol}`);
    return res.data;
}

export async function getActivosByTipoId(id: number): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/tipo/${id}`);
    cacheActivos(res.data);
    return res.data;
}

export async function getActivosNoMoneda(): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>("/api/activos/no-monedas");
    cacheActivos(res.data, true);
    return res.data;
}

export async function getRankingActivos(criterio: string = "variacion", desc: boolean = true, tipoId?: number): Promise<ActivoDTO[]> {
    const params: any = { criterio, desc };
    if (tipoId) params.tipoId = tipoId;

    const res = await http.get<ActivoDTO[]>("/api/activos/ranking", { params });
    cacheActivos(res.data, !tipoId);
    return res.data;
}

export async function searchActivos(texto: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/buscar?q=${encodeURIComponent(texto)}`);
    cacheActivos(res.data);
    return res.data;
}

export async function getActivosBySector(sectorId: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/sector/${sectorId}`);
    cacheActivos(res.data);
    return res.data;
}

export async function getActivosByTipoAndSector(tipoId: number, sectorId: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/tipo/${tipoId}/sector/${sectorId}`);
    cacheActivos(res.data);
    return res.data;
}

export async function getActivosFavoritos(): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>("/api/activos/favoritos");
    cacheActivos(res.data, true);
    return res.data;
}

export async function toggleSeguirActivo(id: string): Promise<void> {
    await http.post(`/api/activos/${id}/seguir`);
}
