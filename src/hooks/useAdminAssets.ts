import { useState, useCallback, useEffect } from 'react';
import { ActivoDTO } from '@/types/Activo';
import { getActivosNoMoneda } from '@/services/ActivosService';

export function useAdminAssets() {
    const [activos, setActivos] = useState<ActivoDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const loadActivos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getActivosNoMoneda();
            setActivos(data);
        } catch (error) {
            console.error('Error loading assets:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadActivos();
    }, [loadActivos]);

    return { activos, loading, loadActivos };
}
