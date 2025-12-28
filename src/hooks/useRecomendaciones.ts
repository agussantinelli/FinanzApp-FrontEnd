import { useState, useCallback, useEffect } from "react";
import { RecomendacionDTO, RecomendacionResumenDTO } from "@/types/Recomendacion";
import * as service from "@/services/RecomendacionesService";
import { cacheRecomendaciones, getAllRecomendacionesFromCache } from "@/lib/recomendaciones-cache";

interface FilterState {
    soloActivas: boolean;
    sectorId?: string;
    autorId?: string;
    activoId?: string;
    horizonteId?: number;
    riesgoId?: number;
    adminStateFilter?: number;
}

export function useRecomendaciones(initialOptions?: { soloActivas?: boolean; enabled?: boolean; requireFilter?: boolean; enCursoOnly?: boolean }) {
    const [data, setData] = useState<RecomendacionResumenDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({ soloActivas: initialOptions?.soloActivas ?? true });
    const enabled = initialOptions?.enabled ?? true;
    const requireFilter = initialOptions?.requireFilter ?? false;
    const enCursoOnly = initialOptions?.enCursoOnly ?? false;

    const applyFilters = useCallback((newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ soloActivas: true });
    }, []);

    const fetchData = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        setError(null);

        const isGenericFetch = !filters.sectorId && !filters.autorId && !filters.activoId && !filters.horizonteId && !filters.riesgoId;

        if (requireFilter && isGenericFetch) {
            setLoading(false);
            return;
        }

        if (isGenericFetch) {
            const cached = getAllRecomendacionesFromCache();
            if (cached && cached.length > 0) {
                // Logic to use cache if valid? Assuming cache strategy handles this
                // For now, let's keep it simple and just re-fetch to ensure fresh active data
            }
        }

        try {
            let res: RecomendacionResumenDTO[] = [];

            // Pass filters.soloActivas (defaults true) to all
            if (filters.sectorId) {
                res = await service.getRecomendacionesBySector(filters.sectorId, filters.soloActivas);
            } else if (filters.autorId) {
                if (enCursoOnly) {
                    res = await service.getRecomendacionesEnCursoByAutor(filters.autorId);
                } else {
                    res = await service.getRecomendacionesByAutor(filters.autorId, filters.soloActivas);
                }
            } else if (filters.activoId) {
                res = await service.getRecomendacionesByActivo(filters.activoId, filters.soloActivas);
            } else if (filters.horizonteId) {
                res = await service.getRecomendacionesByHorizonte(filters.horizonteId, filters.soloActivas);
            } else if (filters.riesgoId) {
                res = await service.getRecomendacionesByRiesgo(filters.riesgoId, filters.soloActivas);
                // Admin specific filter
            } else if (filters.adminStateFilter !== undefined) {
                if (filters.adminStateFilter === -1) {
                    res = await service.getRecomendacionesActivasPendientes();
                } else {
                    res = await service.getRecomendacionesAdmin(filters.adminStateFilter);
                }
            } else {
                res = await service.getRecomendaciones(filters.soloActivas);
            }

            setData(res);
            cacheRecomendaciones(res, isGenericFetch);
        } catch (err) {
            console.error("Error fetching recomendaciones:", err);
            setError("No se pudieron cargar las recomendaciones.");
        } finally {
            setLoading(false);
        }
    }, [filters, enabled]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchRecientes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await service.getRecomendacionesRecientes();
            setData(res);
            cacheRecomendaciones(res);
        } catch (err) {
            setError("Error al cargar recientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        filters,
        applyFilters,
        clearFilters,
        refresh: fetchData,
        fetchRecientes
    };
}
