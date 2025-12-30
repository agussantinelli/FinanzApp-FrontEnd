import { useState, useCallback, useEffect } from 'react';
import { RecomendacionResumenDTO } from '@/types/Recomendacion';
import { getRecomendacionesAdmin, destacarRecomendacion, resolverRecomendacion, aprobarRecomendacion, rechazarRecomendacion } from '@/services/RecomendacionesService';

export function useAdminRecommendations() {
    const [recommendations, setRecommendations] = useState<RecomendacionResumenDTO[]>([]);
    const [filter, setFilter] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const loadRecommendations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const estado = filter === '' ? undefined : filter;
            const data = await getRecomendacionesAdmin(estado);
            setRecommendations(data);
        } catch (error) {
            console.error("Error fetching recs", error);
            setError("Error al cargar las recomendaciones.");
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadRecommendations();
    }, [loadRecommendations]);

    const toggleDestacar = async (id: string) => {
        setError(null);
        try {
            await destacarRecomendacion(id);
            await loadRecommendations();
        } catch (e) {
            console.error(e);
            setError("Error al destacar/quitar destacar la recomendación.");
        }
    };

    const resolver = async (id: string, acierto: boolean) => {
        setError(null);
        try {
            await resolverRecomendacion(id, acierto);
            await loadRecommendations();
        } catch (e) {
            console.error(e);
            setError("Error al resolver la recomendación.");
        }
    };

    const aprobar = async (id: string) => {
        setError(null);
        try {
            await aprobarRecomendacion(id);
            await loadRecommendations();
        } catch (e) {
            console.error(e);
            setError("Error al aprobar la recomendación.");
        }
    };

    const rechazar = async (id: string) => {
        setError(null);
        try {
            await rechazarRecomendacion(id);
            await loadRecommendations();
        } catch (e) {
            console.error(e);
            setError("Error al rechazar la recomendación.");
        }
    };

    return {
        recommendations,
        loading,
        error,
        filter,
        setFilter,
        loadRecommendations,
        toggleDestacar,
        resolver,
        aprobar,
        rechazar
    };
}
