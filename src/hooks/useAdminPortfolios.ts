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
            // 1. Fetch the list (which might have stale data)
            const listData = await getPortafoliosAdmin();

            // 2. Fetch fresh detailed valuations for each portfolio to ensure data consistency
            // This fixes the issue where "admin/todos" returns stale/incorrect totals
            const detailPromises = listData.map(p => getPortafolioValuado(p.id).catch(e => {
                console.error(`Failed to load details for ${p.id}`, e);
                return null;
            }));

            const details = await Promise.all(detailPromises);

            // 3. Merge fresh data into the list
            const mergedData = listData.map((p, index) => {
                const detail = details[index];
                if (!detail) return p;

                return {
                    ...p,
                    totalValuadoUSD: detail.totalDolares, // Map totalDolares -> totalValuadoUSD
                    totalValuadoARS: detail.totalPesos,   // Map totalPesos -> totalValuadoARS
                    // Assuming PortafolioValuadoDTO uses totalDolares/Pesos naming convention
                    // We need to keep totalInvertido if detail doesn't have it, OR use detail's if available
                    // checking PortafolioValuadoDTO: it usually has calculated totals.
                    // If PortafolioValuadoDTO lacks totalInvertido, we keep the original p's IF we trust it.
                    // BUT user says "Calculos".
                    // Let's assume detail has correct "totalInvertido" inferred?
                    // PortafolioValuadoDTO has: totalPesos, totalDolares, gananciaPesos, gananciaDolares
                    // So Invertido = Valuado - Ganancia
                    totalInvertidoUSD: detail.totalDolares - detail.gananciaDolares,
                    totalInvertidoARS: detail.totalPesos - detail.gananciaPesos,

                    // Add direct profitability fields
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

    const handleToggleTop = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setPortfolios(prev => prev.map(p =>
                p.id === id ? { ...p, esTop: !currentStatus } : p
            ));

            await toggleTopPortafolio(id, !currentStatus);
        } catch (err) {
            console.error("Error toggling top:", err);
            // Revert
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
