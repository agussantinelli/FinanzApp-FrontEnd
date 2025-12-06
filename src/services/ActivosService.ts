import { http } from "./Http";
import { ActivoDTO } from "@/types/Activo";

// In-memory cache
const assetsCache = new Map<string, ActivoDTO>();
let isFullCache = false;

export function getActivoFromCache(id: string): ActivoDTO | undefined {
    return assetsCache.get(id);
}

export function getAllActivosFromCache(): ActivoDTO[] | null {
    if (!isFullCache) return null;
    return Array.from(assetsCache.values());
}

function cacheActivos(activos: ActivoDTO[], fullList: boolean = false) {
    activos.forEach(a => assetsCache.set(a.id, a));
    if (fullList) isFullCache = true;
}

export async function getActivos(tipo?: string): Promise<ActivoDTO[]> {
    const params = tipo && tipo !== "Todos" ? { tipo } : {};
    const res = await http.get<ActivoDTO[]>("/api/activos", { params });
    // If no type filter, we assume it's the full list
    cacheActivos(res.data, !tipo || tipo === "Todos");
    return res.data;
}

export async function getActivoById(id: string): Promise<ActivoDTO> {
    const res = await http.get<ActivoDTO>(`/api/activos/${id}`);
    return res.data;
}

export async function getActivosByTipoId(id: number): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/tipo/${id}`);
    cacheActivos(res.data);
    return res.data;
}

export async function getActivosNoMoneda(): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>("/api/activos/no-moneda");
    cacheActivos(res.data, true);
    return res.data;
}

export async function getRankingActivos(criterio: string = "variacion", desc: boolean = true, tipoId?: number): Promise<ActivoDTO[]> {
    const params: any = { criterio, desc };
    if (tipoId) params.tipoId = tipoId;

    const res = await http.get<ActivoDTO[]>("/api/activos/ranking", { params });
    // Ranking returns all items sorted, so it's a full list if not filtered by type (though backend supports typeId)
    // If tipoId is undefined, it is full list.
    cacheActivos(res.data, !tipoId);
    return res.data;
}

export async function searchActivos(texto: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/buscar/${texto}`);
    cacheActivos(res.data);
    return res.data;
}

export async function getActivosBySector(sectorId: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/filtrar/sector/${sectorId}`);
    cacheActivos(res.data);
    return res.data;
}

export async function getActivosByTipoAndSector(tipoId: number, sectorId: string): Promise<ActivoDTO[]> {
    const res = await http.get<ActivoDTO[]>(`/api/activos/filtrar/tipo/${tipoId}/sector/${sectorId}`);
    cacheActivos(res.data);
    return res.data;
}
