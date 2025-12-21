import { useState, useEffect } from 'react';
import { getMisPortafolios, getPortafolioValuado } from "@/services/PortafolioService";
import { PortafolioDTO, PortafolioValuadoDTO } from "@/types/Portafolio";

export function usePortfolioData() {
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [valuacion, setValuacion] = useState<PortafolioValuadoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        getMisPortafolios()
            .then((data) => {
                if (!isMounted) return;
                setPortfolios(data);
                if (data.length > 0) {
                    const firstId = data[0].id;
                    setSelectedId(firstId);
                    return getPortafolioValuado(firstId);
                }
                return null;
            })
            .then((val) => {
                if (!isMounted) return;
                if (val) setValuacion(val);
                setLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error(err);
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

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
        handlePortfolioChange
    };
}
