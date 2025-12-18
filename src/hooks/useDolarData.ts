import { useState, useCallback, useEffect, useMemo } from 'react';
import { getCotizacionesDolar } from "@/services/DolarService";
import { DolarDTO } from "@/types/Dolar";

function titleCase(s: string) {
    return s.trim().replace(/\s+/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function normalizeName(nombreRaw?: string | null) {
    if (!nombreRaw) return "";
    const n = nombreRaw.trim().toLowerCase();
    if (n.includes("contado con liqui") || n.includes("contado") || n.includes("liqui") || n.includes("liquid")) return "CCL";
    if (n.includes("bolsa") || n.includes("mep")) return "MEP";
    if (n.includes("oficial")) return "Oficial";
    if (n.includes("blue") || n.includes("informal")) return "Blue";
    if (n.includes("tarjeta") || n.includes("qatar") || n.includes("solidario") || n.includes("turista") || n.includes("card")) return "Tarjeta";
    if (n.includes("mayorista")) return "Mayorista";
    if (n.includes("cripto") || n.includes("crypto")) return "Cripto";
    return titleCase(nombreRaw);
}

export function useDolarData() {
    const [data, setData] = useState<DolarDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCotizacionesDolar();
            setData(res ?? []);
            setUpdatedAt(new Date());
        } catch (error) {
            console.error("Error fetching dolar rates:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 300_000);
        return () => clearInterval(id);
    }, [fetchData]);

    const uniqueData = useMemo(() => {
        const seen = new Set<string>();
        const out: DolarDTO[] = [];
        for (const c of data ?? []) {
            const n = normalizeName(c?.nombre);
            if (!n || n === "—") continue;
            if (seen.has(n)) continue;
            seen.add(n);
            out.push({ ...c, nombre: n });
        }
        return out;
    }, [data]);

    const firstRow = useMemo(() => uniqueData.slice(0, 4), [uniqueData]);
    const secondRow = useMemo(() => uniqueData.slice(4), [uniqueData]);

    return {
        firstRow,
        secondRow,
        loading,
        updatedAt,
        fetchData,
        normalizeName // Exporting if needed by component for individual card logic
    };
}
