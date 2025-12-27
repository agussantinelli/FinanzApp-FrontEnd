import { useState, useEffect, useCallback } from 'react';
import { PortafolioDTO } from '@/types/Portafolio';
import { getPortafoliosAdmin, toggleDestacado, deletePortafolio } from '@/services/PortafolioService';

export function useAdminPortfolios() {
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPortfolios = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPortafoliosAdmin();
            setPortfolios(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching portfolios:", err);
            setError("Failed to load portfolios");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolios();
    }, [fetchPortfolios]);

    const handleToggleDestacado = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setPortfolios(prev => prev.map(p =>
                p.id === id ? { ...p, esDestacado: !currentStatus } : p
            ));

            await toggleDestacado(id, !currentStatus);
        } catch (err) {
            console.error("Error toggling destacado:", err);
            // Revert
            fetchPortfolios();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este portafolio?")) return;

        try {
            // Optimistic update
            setPortfolios(prev => prev.filter(p => p.id !== id));
            await deletePortafolio(id);
        } catch (err) {
            console.error("Error deleting portfolio:", err);
            fetchPortfolios();
        }
    };

    return {
        portfolios,
        loading,
        error,
        refresh: fetchPortfolios,
        toggleDestacado: handleToggleDestacado,
        deletePortafolio: handleDelete
    };
}
