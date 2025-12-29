import { useState, useCallback, useEffect } from 'react';
import { ActivoDTO, ActivoCreateDTO, ActivoUpdateDTO } from '@/types/Activo';
import { getActivosNoMoneda, createActivo, updateActivo, deleteActivo } from '@/services/ActivosService';

export function useAdminAssets() {
    const [activos, setActivos] = useState<ActivoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadActivos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getActivosNoMoneda();
            setActivos(data);
        } catch (error) {
            console.error('Error loading assets:', error);
            setError("Error al cargar la lista de activos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadActivos();
    }, [loadActivos]);

    const addAsset = async (dto: ActivoCreateDTO) => {
        setLoading(true);
        setError(null);
        try {
            await createActivo(dto);
            await loadActivos();
        } catch (error) {
            console.error('Error creating asset:', error);
            setError("Error al crear el activo.");
        } finally {
            setLoading(false);
        }
    };

    const updateAsset = async (id: string, dto: ActivoUpdateDTO) => {
        setLoading(true);
        setError(null);
        try {
            await updateActivo(id, dto);
            await loadActivos();
        } catch (error) {
            console.error('Error updating asset:', error);
            setError("Error al actualizar el activo.");
        } finally {
            setLoading(false);
        }
    };

    const removeAsset = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteActivo(id);
            await loadActivos();
        } catch (error) {
            console.error('Error deleting asset:', error);
            setError("Error al eliminar el activo.");
        } finally {
            setLoading(false);
        }
    };

    return { activos, loading, error, loadActivos, addAsset, updateAsset, removeAsset };
}
