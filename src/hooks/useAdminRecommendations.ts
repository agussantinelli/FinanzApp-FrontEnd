import { useState, useCallback, useEffect } from 'react';
import { RecomendacionResumenDTO } from '@/types/Recomendacion';
import { getRecomendacionesAdmin, destacarRecomendacion, resolverRecomendacion, aprobarRecomendacion, rechazarRecomendacion } from '@/services/RecomendacionesService';

export function useAdminRecommendations() {
    const [recommendations, setRecommendations] = useState<RecomendacionResumenDTO[]>([]);
    const [filter, setFilter] = useState<number | ''>(''); // '' = All
    const [loading, setLoading] = useState(false);

    const loadRecommendations = useCallback(async () => {
        setLoading(true);
        try {
            const estado = filter === '' ? undefined : filter;
            const data = await getRecomendacionesAdmin(estado);
            setRecommendations(data);
        } catch (error) {
            console.error("Error fetching recs", error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadRecommendations();
    }, [loadRecommendations]);

    const toggleDestacar = async (id: string) => {
        await destacarRecomendacion(id);
        loadRecommendations();
    };

    const resolver = async (id: string, acierto: boolean) => {
        await resolverRecomendacion(id, acierto);
        loadRecommendations();
    };

    const aprobar = async (id: string) => {
        await aprobarRecomendacion(id);
        loadRecommendations();
    };

    const rechazar = async (id: string) => {
        await rechazarRecomendacion(id);
        loadRecommendations();
    };

    return {
        recommendations,
        loading,
        filter,
        setFilter,
        loadRecommendations,
        toggleDestacar,
        resolver,
        aprobar,
        rechazar
    };
}
