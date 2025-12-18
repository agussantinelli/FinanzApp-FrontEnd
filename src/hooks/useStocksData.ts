import { useState, useCallback, useEffect, useMemo } from 'react';
import { getStockDuals } from "@/services/StocksService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DualQuoteDTO } from "@/types/Market";

function isCCL(nombreRaw: string) {
    const n = (nombreRaw || "").toLowerCase();
    return n.includes("contado") || n.includes("liqui") || n.includes("liquid") || n.includes("ccl");
}

type PairReq = { localBA: string; usa: string; name: string; cedearRatio?: number | null };

const ENERGETICO: PairReq[] = [
    { localBA: "YPFD.BA", usa: "YPF", name: "YPF" },
    { localBA: "PAMP.BA", usa: "PAM", name: "Pampa Energía" },
    { localBA: "VIST.BA", usa: "VIST", name: "Vista Energy" },
];
const BANCARIO: PairReq[] = [
    { localBA: "BMA.BA", usa: "BMA", name: "Banco Macro" },
    { localBA: "GGAL.BA", usa: "GGAL", name: "Banco Galicia" },
    { localBA: "SUPV.BA", usa: "SUPV", name: "Banco Supervielle" },
];
const EXTRA: PairReq[] = [
    { localBA: "LOMA.BA", usa: "LOMA", name: "Loma Negra" },
    { localBA: "CEPU.BA", usa: "CEPU", name: "Central Puerto" },
    { localBA: "MELI.BA", usa: "MELI", name: "Mercado Libre", cedearRatio: 2 },
];

function chunk<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export function useStocksData() {
    const ALL_PAIRS = useMemo(() => [...ENERGETICO, ...BANCARIO, ...EXTRA], []);
    const [data, setData] = useState<DualQuoteDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [cclRate, setCclRate] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchCCL = useCallback(async () => {
        const cot = await getCotizacionesDolar();
        const ccl = cot.find(c => isCCL(c.nombre));
        setCclRate(ccl?.venta ?? null);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const pairsForApi = ALL_PAIRS.map(p => ({
                localBA: p.localBA,
                usa: p.usa,
                cedearRatio: p.cedearRatio ?? null,
            }));
            const [duals] = await Promise.all([getStockDuals(pairsForApi as any, "CCL"), fetchCCL()]);
            setData(duals);
            setUpdatedAt(new Date());
        } catch (e: any) {
            console.error(e);
            setError(e?.response?.data?.title ?? "No se pudo cargar. Reintentá.");
        } finally {
            setLoading(false);
        }
    }, [ALL_PAIRS, fetchCCL]);

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 300_000);
        return () => clearInterval(id);
    }, [fetchData]);

    const bySymbol = useMemo(() => new Map(data.map(d => [d.localSymbol.toUpperCase(), d])), [data]);

    function pick(list: PairReq[]) {
        const arr: (DualQuoteDTO & { name: string })[] = [];
        for (const p of list) {
            const d = bySymbol.get(p.localBA.toUpperCase());
            if (!d) continue;
            const ratio = d.cedearRatio ?? p.cedearRatio ?? undefined;
            const rate = cclRate && cclRate > 0 ? cclRate : d.usedDollarRate;
            arr.push({ ...d, name: p.name, cedearRatio: ratio, usedDollarRate: rate });
        }
        return arr;
    }

    const energetico = useMemo(() => pick(ENERGETICO), [bySymbol, cclRate]);
    const bancario = useMemo(() => pick(BANCARIO), [bySymbol, cclRate]);
    const extra = useMemo(() => pick(EXTRA), [bySymbol, cclRate]);

    const rowsEnergetico = useMemo(() => chunk(energetico, 3), [energetico]);
    const rowsBancario = useMemo(() => chunk(bancario, 3), [bancario]);
    const rowsExtra = useMemo(() => chunk(extra, 3), [extra]);

    return {
        rowsEnergetico,
        rowsBancario,
        rowsExtra,
        loading,
        error,
        updatedAt,
        fetchData
    };
}
