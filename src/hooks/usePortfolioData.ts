import { useState, useEffect, useCallback } from 'react';
import { getMisPortafolios, getPortafolioValuado } from "@/services/PortafolioService";
import { PortafolioDTO, PortafolioValuadoDTO } from "@/types/Portafolio";

export function usePortfolioData() {
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [valuacion, setValuacion] = useState<PortafolioValuadoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        setLoading(true);
        getMisPortafolios()
            .then((data) => {
                setPortfolios(data);
                if (data.length > 0) {
                    // Use currently selected ID if valid, otherwise default to first
                    // We need to check if the selectedId (from state closure) is still in the new list?
                    // For simplicity, if we have a selectedId, reuse it.
                    // Note: selectedId here is from the closure when refresh was created.

                    // To avoid stale closure issues with selectedId if we didn't add it to deps, 
                    // we can use a functional update approach or ref, but adding to deps is fine.
                    const targetId = (selectedId && data.some(p => p.id === selectedId)) ? selectedId : data[0].id;

                    if (targetId !== selectedId) {
                        setSelectedId(targetId);
                    }

                    return getPortafolioValuado(targetId);
                } else {
                    setValuacion(null);
                    return null;
                }
            })
            .then((val) => {
                if (val) setValuacion(val);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedId]);

    useEffect(() => {
        refresh();

        // Optional: Auto-refresh on window focus to ensure data is fresh when returning to tab
        const onFocus = () => refresh();
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [refresh]);

    const handlePortfolioChange = (newId: string) => {
        setSelectedId(newId);
        setLoading(true);
        getPortafolioValuado(newId)
            .then((val) => {
                setValuacion(val);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    return {
        portfolios,
        selectedId,
        valuacion,
        loading,
        handlePortfolioChange,
        refresh
    };
}
