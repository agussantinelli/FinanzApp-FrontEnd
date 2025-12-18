import { RecomendacionDTO } from "@/types/Recomendacion";

const recsCache = new Map<string, RecomendacionDTO>();
let isFullCache = false;

export function getRecomendacionFromCache(id: string): RecomendacionDTO | undefined {
    return recsCache.get(id);
}

export function getAllRecomendacionesFromCache(): RecomendacionDTO[] | null {
    if (!isFullCache && recsCache.size === 0) return null;
    return Array.from(recsCache.values());
}

export function cacheRecomendaciones(list: RecomendacionDTO[], fullList: boolean = false) {
    list.forEach(r => recsCache.set(r.id, r));
    if (fullList) isFullCache = true;
}

export function clearRecomendacionesCache() {
    recsCache.clear();
    isFullCache = false;
}
