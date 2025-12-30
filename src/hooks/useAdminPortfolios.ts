import { useState, useEffect, useCallback } from 'react';
import { PortafolioDTO } from '@/types/Portafolio';
import { getPortafoliosAdmin, toggleDestacado, deletePortafolio, getPortafolioValuado, toggleTopPortafolio } from '@/services/PortafolioService';

export function useAdminPortfolios() {
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPortfolios = useCallback(async () => {
        setLoading(true);
        try {
            const listData = await getPortafoliosAdmin();

            const detailPromises = listData.map(p => getPortafolioValuado(p.id).catch(e => {
                console.error(`Failed to load details for ${p.id}`, e);
                return null;
            }));

            const details = await Promise.all(detailPromises);

            const mergedData = listData.map((p, index) => {
                const detail = details[index];
                if (!detail) return p;

                return {
                    ...p,
                    totalValuadoUSD: detail.totalDolares,
                    totalValuadoARS: detail.totalPesos,
                    totalInvertidoUSD: detail.totalDolares - detail.gananciaDolares,
                    totalInvertidoARS: detail.totalPesos - detail.gananciaPesos,

                    gananciaDolares: detail.gananciaDolares,
                    gananciaPesos: detail.gananciaPesos,
                    variacionPorcentajeDolares: detail.variacionPorcentajeDolares,
                    variacionPorcentajePesos: detail.variacionPorcentajePesos
                };
            });

            setPortfolios(mergedData);
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
            setPortfolios(prev => prev.map(p =>
                p.id === id ? { ...p, esDestacado: !currentStatus } : p
            ));

            await toggleDestacado(id, !currentStatus);
        } catch (err) {
            console.error("Error toggling destacado:", err);
            fetchPortfolios();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este portafolio?")) return;

        try {
            setPortfolios(prev => prev.filter(p => p.id !== id));
            await deletePortafolio(id);
        } catch (err) {
            console.error("Error deleting portfolio:", err);
            fetchPortfolios();
        }
    };

    const handleToggleTop = async (id: string, currentStatus: boolean) => {
        try {
            setPortfolios(prev => prev.map(p =>
                p.id === id ? { ...p, esTop: !currentStatus } : p
            ));

            await toggleTopPortafolio(id, !currentStatus);
        } catch (err) {
            console.error("Error toggling top:", err);
            fetchPortfolios();
        }
    };

    return {
        portfolios,
        loading,
        error,
        refresh: fetchPortfolios,
        toggleDestacado: handleToggleDestacado,
        toggleTop: handleToggleTop,
        deletePortafolio: handleDelete
    };
}
