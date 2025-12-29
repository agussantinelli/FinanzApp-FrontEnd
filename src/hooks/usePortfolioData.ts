import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { getMisPortafolios, getPortafolioValuado } from "@/services/PortafolioService";
import { PortafolioDTO, PortafolioValuadoDTO } from "@/types/Portafolio";

export function usePortfolioData() {
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [valuacion, setValuacion] = useState<PortafolioValuadoDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated } = useAuth();

    // 1. Fetch Portfolio List (Only once when auth ready)
    useEffect(() => {
        if (!isAuthenticated) return;

        let isMounted = true;
        setLoading(true);

        getMisPortafolios()
            .then(data => {
                if (!isMounted) return;
                setPortfolios(data);
                if (data.length > 0 && !selectedId) {
                    // Set default selected ID if none selected
                    setSelectedId(data[0].id);
                } else if (data.length === 0) {
                    setLoading(false); // Nothing to load for details
                }
            })
            .catch(err => {
                console.error("Error fetching portfolios", err);
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [isAuthenticated]); // Removed selectedId dependency

    // 2. Fetch Portfolio Details (Whenever selectedId changes)
    const fetchDetails = useCallback(async (id: string) => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getPortafolioValuado(id);
            setValuacion(data);
        } catch (error) {
            console.error("Error fetching portfolio details", error);
            setError("Error al cargar los detalles del portafolio.");
            setValuacion(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedId) {
            fetchDetails(selectedId);
        }
    }, [selectedId, fetchDetails]);

    const handlePortfolioChange = (newId: string) => {
        setSelectedId(newId);
    };

    const refreshPortfolios = useCallback(() => {
        setLoading(true);
        setError(null);
        getMisPortafolios()
            .then(data => {
                setPortfolios(data);
                // If the selected ID is no longer in the list (deleted), or if we had none, select the first one
                if (data.length > 0) {
                    if (!selectedId || !data.find(p => p.id === selectedId)) {
                        setSelectedId(data[0].id);
                    }
                } else {
                    setSelectedId("");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error refreshing portfolios", err);
                setError("Error al actualizar la lista de portafolios.");
                setLoading(false);
            });
    }, [selectedId]);

    const refresh = useCallback(() => {
        if (selectedId) fetchDetails(selectedId);
    }, [selectedId, fetchDetails]);

    return {
        portfolios,
        selectedId,
        valuacion,
        loading,
        error,
        handlePortfolioChange,
        refresh,
        refreshPortfolios
    };
}
