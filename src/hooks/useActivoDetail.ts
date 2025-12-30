import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActivoDTO } from '@/types/Activo';
import { getActivoById, searchActivos, getActivoByTicker } from '@/services/ActivosService';
import { getRecomendacionesByActivo, getRecomendacionById } from '@/services/RecomendacionesService';
import { RecomendacionResumenDTO, RecomendacionDetalleDTO, RecomendacionDTO } from '@/types/Recomendacion';
import { getActivoFromCache } from '@/lib/activos-cache';
import { getCurrentUser } from '@/services/AuthService';

export interface ActiveRecommendation {
    summary: RecomendacionResumenDTO;
    detail?: RecomendacionDetalleDTO;
}

export function useActivoDetail(id: string) {
    const [activo, setActivo] = useState<ActivoDTO | null>(null);
    const [activeRecommendations, setActiveRecommendations] = useState<ActiveRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadActivo = async () => {
            try {
                let currentActivo: ActivoDTO | null = null;


                const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

                if (isUuid) {

                    const cached = getActivoFromCache(id);
                    if (cached) {
                        currentActivo = cached;
                    } else {
                        currentActivo = await getActivoById(id);
                    }
                } else {

                    const params = decodeURIComponent(id);
                    try {
                        currentActivo = await getActivoByTicker(params);
                    } catch (err) {
                        console.warn(`Direct ticker fetch failed for ${params}, trying search fallback...`);


                        const results = await searchActivos(params);
                        if (results && results.length > 0) {
                            const exactMatch = results.find((a: ActivoDTO) => a.symbol.toLowerCase() === params.toLowerCase());
                            currentActivo = exactMatch || results[0];
                        }
                    }
                }

                setActivo(currentActivo);


                if (currentActivo) {
                    const user = getCurrentUser();
                    if (user) {
                        const recs = await getRecomendacionesByActivo(currentActivo.id, true);


                        const detailedRecs = await Promise.all(recs.map(async (r) => {
                            try {

                                const fullRec = await getRecomendacionById(r.id);
                                const specificDetail = fullRec.detalles.find(d => d.activoId === currentActivo!.id);

                                return {
                                    summary: r,
                                    detail: specificDetail
                                };
                            } catch (e) {
                                console.error(`Error fetching detail for recommendation ${r.id}`, e);
                                return { summary: r, detail: undefined };
                            }
                        }));

                        setActiveRecommendations(detailedRecs);
                    }
                }

            } catch (error) {
                console.error("Error loading asset details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadActivo();
        }
    }, [id]);

    return {
        activo,
        activeRecommendations,
        loading,
        updateActivoState: setActivo
    };
}
