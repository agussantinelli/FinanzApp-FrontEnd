import { useState, useCallback, useEffect } from 'react';
import { ActivoDTO, ActivoCreateDTO, ActivoUpdateDTO } from '@/types/Activo';
import { getActivosNoMoneda, createActivo, updateActivo, deleteActivo } from '@/services/ActivosService';

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

    const addAsset = async (dto: ActivoCreateDTO) => {
        setLoading(true);
        try {
            await createActivo(dto);
            await loadActivos();
        } catch (error) {
            console.error('Error creating asset:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateAsset = async (id: string, dto: ActivoUpdateDTO) => {
        setLoading(true);
        try {
            await updateActivo(id, dto);
            await loadActivos();
        } catch (error) {
            console.error('Error updating asset:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeAsset = async (id: string) => {
        setLoading(true);
        try {
            await deleteActivo(id);
            await loadActivos();
        } catch (error) {
            console.error('Error deleting asset:', error);
        } finally {
            setLoading(false);
        }
    };

    return { activos, loading, loadActivos, addAsset, updateAsset, removeAsset };
}
