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
}

export function useRecomendaciones() {
    const [data, setData] = useState<RecomendacionResumenDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({ soloActivas: true });

    const applyFilters = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const clearFilters = () => {
        setFilters({ soloActivas: true });
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const isGenericFetch = !filters.sectorId && !filters.autorId && !filters.activoId && !filters.horizonteId && !filters.riesgoId;
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
                res = await service.getRecomendacionesByAutor(filters.autorId, filters.soloActivas);
            } else if (filters.activoId) {
                res = await service.getRecomendacionesByActivo(filters.activoId, filters.soloActivas);
            } else if (filters.horizonteId) {
                res = await service.getRecomendacionesByHorizonte(filters.horizonteId, filters.soloActivas);
            } else if (filters.riesgoId) {
                res = await service.getRecomendacionesByRiesgo(filters.riesgoId, filters.soloActivas);
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
    }, [filters]);

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
