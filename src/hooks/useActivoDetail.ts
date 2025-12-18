import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActivoDTO } from '@/types/Activo';
import { getActivoById } from '@/services/ActivosService';
import { getActivoFromCache } from '@/lib/cache';

export function useActivoDetail(id: string) {
    const [activo, setActivo] = useState<ActivoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadActivo = async () => {
            try {
                // Try to get from cache first
                const cached = getActivoFromCache(id);
                if (cached) {
                    setActivo(cached);
                    setLoading(false);
                    return;
                }

                // If not in cache, fetch from backend (by ID, not all)
                const data = await getActivoById(id);
                setActivo(data);
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
