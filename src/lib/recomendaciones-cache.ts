import { RecomendacionDTO, RecomendacionResumenDTO } from "@/types/Recomendacion";

const recsCache = new Map<string, RecomendacionDTO | RecomendacionResumenDTO>();
let isFullCache = false;

export function getRecomendacionFromCache(id: string): RecomendacionDTO | RecomendacionResumenDTO | undefined {
    return recsCache.get(id);
}

export function getAllRecomendacionesFromCache(): (RecomendacionDTO | RecomendacionResumenDTO)[] | null {
    if (!isFullCache && recsCache.size === 0) return null;
    return Array.from(recsCache.values());
}

export function cacheRecomendaciones(list: (RecomendacionDTO | RecomendacionResumenDTO)[], fullList: boolean = false) {
    list.forEach(r => recsCache.set(r.id, r));
    if (fullList) isFullCache = true;
}

export function clearRecomendacionesCache() {
    recsCache.clear();
    isFullCache = false;
}