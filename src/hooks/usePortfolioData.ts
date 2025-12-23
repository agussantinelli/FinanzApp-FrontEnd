import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { getMisPortafolios, getPortafolioValuado } from "@/services/PortafolioService";
import { PortafolioDTO, PortafolioValuadoDTO } from "@/types/Portafolio";

export function usePortfolioData() {
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [valuacion, setValuacion] = useState<PortafolioValuadoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const { isAuthenticated } = useAuth();

    const refresh = useCallback(() => {
        if (!isAuthenticated) {
            setLoading(false);
            setPortfolios([]);
            setValuacion(null);
            return;
        }

        setLoading(true);
        getMisPortafolios()
            .then((data) => {
                setPortfolios(data);
                if (data.length > 0) {
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
    }, [selectedId, isAuthenticated]);

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
