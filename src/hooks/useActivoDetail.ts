import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActivoDTO } from '@/types/Activo';
import { getActivoById, searchActivos } from '@/services/ActivosService';
import { getActivoFromCache } from '@/lib/activos-cache';

export function useActivoDetail(id: string) {
    const [activo, setActivo] = useState<ActivoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadActivo = async () => {
            try {
                // If ID is valid UUID, fetch by ID
                const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

                if (isUuid) {
                    // Try to get from cache first
                    const cached = getActivoFromCache(id);
                    if (cached) {
                        setActivo(cached);
                        setLoading(false);
                        return;
                    }
                    const data = await getActivoById(id);
                    setActivo(data);
                } else {
                    // It's likely a Ticker/Symbol
                    const params = decodeURIComponent(id);
                    const results = await searchActivos(params);

                    if (results && results.length > 0) {
                        // Find exact match first (case insensitive)
                        // Find exact match first (case insensitive)
                        const exactMatch = results.find((a: ActivoDTO) => a.symbol.toLowerCase() === params.toLowerCase());
                        setActivo(exactMatch || results[0]);
                    } else {
                        // Not found by symbol
                        setActivo(null);
                    }
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

    return { activo, loading };
}
