import { ActivoDTO } from "@/types/Activo";

const assetsCache = new Map<string, ActivoDTO>();
let isFullCache = false;

export function getActivoFromCache(id: string): ActivoDTO | undefined {
    return assetsCache.get(id);
}

export function getAllActivosFromCache(): ActivoDTO[] | null {
    if (!isFullCache) return null;
    return Array.from(assetsCache.values());
}

export function cacheActivos(activos: ActivoDTO[], fullList: boolean = false) {
    activos.forEach(a => assetsCache.set(a.id, a));
    if (fullList) isFullCache = true;
}

export function clearCache() {
    assetsCache.clear();
    isFullCache = false;
}
