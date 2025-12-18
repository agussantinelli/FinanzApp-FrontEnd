import { useState, useCallback, useEffect, useMemo } from 'react';
import { getCedearDuals } from "@/services/CedearsService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DualQuoteDTO } from "@/types/Market";

function isCCL(nombreRaw: string) {
    const n = (nombreRaw || "").toLowerCase();
    return n.includes("contado") || n.includes("liqui") || n.includes("liquid") || n.includes("ccl");
}

function chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

export function useCedearsData() {
    const [data, setData] = useState<DualQuoteDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [cclRate, setCclRate] = useState<number | null>(null);

    const fetchCCL = useCallback(async () => {
        const cot = await getCotizacionesDolar();
        const ccl = cot.find(c => isCCL(c.nombre ?? c.nombre));
        setCclRate(ccl?.venta ?? null);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [ced] = await Promise.all([getCedearDuals("CCL"), fetchCCL()]);
            setData(ced);
            setUpdatedAt(new Date());
        } catch (e) {
            console.error("❌ Error en CedearsSection:", e);
        } finally {
            setLoading(false);
        }
    }, [fetchCCL]);

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 300_000);
        return () => clearInterval(id);
    }, [fetchData]);

    const symbolsWanted = useMemo(
        () => new Set(["AAPL.BA", "AMZN.BA", "NVDA.BA", "MSFT.BA", "GOOGL.BA", "META.BA", "TSLA.BA", "BRKB.BA", "KO.BA"]),
        []
    );

    const filtered = useMemo(
        () => data.filter(d => symbolsWanted.has((d.localSymbol || "").toUpperCase())),
        [data, symbolsWanted]
    );

    const withDerived = useMemo(() => {
        const rate = (cclRate && cclRate > 0) ? cclRate : undefined;
        return filtered.map(d => {
            const usedRate = rate ?? d.usedDollarRate;
            return { ...d, usedDollarRate: usedRate };
        });
    }, [filtered, cclRate]);

    const rows = useMemo(() => chunk(withDerived, 3), [withDerived]);

    return {
        rows,
        withDerived,
        loading,
        updatedAt,
        fetchData
    };
}
