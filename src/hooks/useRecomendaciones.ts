import { useState, useCallback, useEffect } from "react";
import { RecomendacionDTO } from "@/types/Recomendacion";
import * as service from "@/services/RecomendacionesService";
import { cacheRecomendaciones, getAllRecomendacionesFromCache } from "@/lib/recomendaciones-cache";

interface FilterState {
    soloActivas: boolean;
    sectorId?: string;
    autorId?: string;
    activoId?: string;
}

export function useRecomendaciones() {
    const [data, setData] = useState<RecomendacionDTO[]>([]);
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

        const isGenericFetch = !filters.sectorId && !filters.autorId && !filters.activoId;
        if (isGenericFetch) {
            const cached = getAllRecomendacionesFromCache();
            if (cached && cached.length > 0) {
            }
        }

        try {
            let res: RecomendacionDTO[] = [];

            if (filters.sectorId) {
                res = await service.getRecomendacionesBySector(filters.sectorId);
            } else if (filters.autorId) {
                res = await service.getRecomendacionesByAutor(filters.autorId);
            } else if (filters.activoId) {
                res = await service.getRecomendacionesByActivo(filters.activoId);
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
