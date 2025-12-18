import { useState, useCallback, useEffect } from "react";
import { RecomendacionDTO, CrearRecomendacionDTO } from "@/types/Recomendacion";
import * as service from "@/services/RecomendacionesService";

export function useRecomendaciones() {
    const [data, setData] = useState<RecomendacionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async (soloActivas: boolean = true) => {
        setLoading(true);
        setError(null);
        try {
            const res = await service.getRecomendaciones(soloActivas);
            setData(res);
        } catch (err) {
            console.error("Error fetching recomendaciones:", err);
            setError("No se pudieron cargar las recomendaciones.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRecientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await service.getRecomendacionesRecientes();
            setData(res);
        } catch (err) {
            console.error("Error fetching recomendaciones recientes:", err);
            setError("No se pudieron cargar las recomendaciones recientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load? Optional. For now let the page decide.
    // useEffect(() => { fetchAll(); }, [fetchAll]);

    return {
        data,
        loading,
        error,
        fetchAll,
        fetchRecientes,
        service // Expose full service if needed for specialized calls
    };
}
