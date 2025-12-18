import { useState, useCallback, useEffect, useMemo } from 'react';
import { getIndices } from "@/services/StocksService";
import { DualQuoteDTO } from "@/types/Market";

function findIndex(data: DualQuoteDTO[], queries: string[]) {
    return data.find(d => {
        const s = (d.usSymbol || "").toUpperCase();
        const l = (d.localSymbol || "").toUpperCase();
        const n = (d.dollarRateName || "").toUpperCase();
        return queries.some(q => s.includes(q) || l.includes(q) || n.includes(q));
    });
}

function formatARS(val?: number | null) {
    if (val === undefined || val === null || isNaN(val)) return "—";
    return val.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function formatUSD(val?: number | null) {
    if (val === undefined || val === null || isNaN(val)) return "—";
    const digits = val > 1000 ? 0 : 2;
    return val.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits });
}

export function useIndicesData() {
    const [data, setData] = useState<DualQuoteDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const indices = await getIndices();
            setData(indices);
            setUpdatedAt(new Date());
        } catch (e) {
            console.error("❌ Error en IndexesSection:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 300_000);
        return () => clearInterval(id);
    }, [fetchData]);

    const lists = useMemo(() => {
        if (!data || data.length === 0) return { row1: [], row2: [], national: [] };

        const spy = findIndex(data, ["SPY", "GSPC"]);
        const nasdaq = findIndex(data, ["NASDAQ", "NDX", "IXIC"]);
        const dow = findIndex(data, ["DOW", "DJI", "DIA"]);

        const xlp = findIndex(data, ["XLP"]);
        const emergentes = findIndex(data, ["EMERGENTES", "EEM"]);
        const ewz = findIndex(data, ["EWZ"]);

        const riesgo = findIndex(data, ["RIESGO", "PAIS"]);
        const merval = findIndex(data, ["MERVAL", "MERV"]);

        return {
            row1: [spy, nasdaq, dow].filter(Boolean) as DualQuoteDTO[],
            row2: [xlp, emergentes, ewz].filter(Boolean) as DualQuoteDTO[],
            national: [merval, riesgo].filter(Boolean) as DualQuoteDTO[],
        };
    }, [data]);

    return {
        data,
        row1: lists.row1,
        row2: lists.row2,
        national: lists.national,
        loading,
        updatedAt,
        fetchData,
        formatARS,
        formatUSD,
    };
}
