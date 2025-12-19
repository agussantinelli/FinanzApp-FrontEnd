import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActivoDTO } from '@/types/Activo';
import { getActivoById, searchActivos } from '@/services/ActivosService';
import { getRecomendacionesByActivo, getRecomendacionById } from '@/services/RecomendacionesService';
import { RecomendacionResumenDTO, RecomendacionDetalleDTO, RecomendacionDTO } from '@/types/Recomendacion';
import { getActivoFromCache } from '@/lib/activos-cache';

export interface ActiveRecommendation {
    summary: RecomendacionResumenDTO;
    detail?: RecomendacionDetalleDTO; // Specific detail for this asset
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

                // If ID is valid UUID, fetch by ID
                const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

                if (isUuid) {
                    // Try to get from cache first
                    const cached = getActivoFromCache(id);
                    if (cached) {
                        currentActivo = cached;
                    } else {
                        currentActivo = await getActivoById(id);
                    }
                } else {
                    // It's likely a Ticker/Symbol
                    const params = decodeURIComponent(id);
                    const results = await searchActivos(params);

                    if (results && results.length > 0) {
                        // Find exact match first (case insensitive)
                        const exactMatch = results.find((a: ActivoDTO) => a.symbol.toLowerCase() === params.toLowerCase());
                        currentActivo = exactMatch || results[0];
                    }
                }

                setActivo(currentActivo);

                // Fetch Recommendations if asset found
                if (currentActivo) {
                    const recs = await getRecomendacionesByActivo(currentActivo.id, true); // true = active only

                    // Fetch details for each recommendation to get the specific target/action for THIS asset
                    const detailedRecs = await Promise.all(recs.map(async (r) => {
                        try {
                            // We need the full detail to know the Action/Target for this specific asset
                            // Optimization idea: The backend could return this in the summary if we asked, but for now we fetch detail.
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

            } catch (error) {
                console.error("Error loading asset details:", error);
                // Optionally redirect or handle error state differently
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadActivo();
        }
    }, [id]);

    return { activo, activeRecommendations, loading };
}
