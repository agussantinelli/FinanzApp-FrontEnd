"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getIndices } from "@/services/StocksService";
import { DualQuoteDTO } from "@/types/Market";
import {
    Paper, Stack, Typography, Button, Grid, Card, CardContent,
    CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import "./styles/IndexesSection.css";

function formatUSD(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    const digits = n > 1000 && Number.isInteger(n) ? 0 : 2;
    return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: digits });
}

// Helper to find index by symbol or name
function findIndex(data: DualQuoteDTO[], queries: string[]) {
    return data.find(d => {
        const s = (d.usSymbol || "").toUpperCase();
        const n = (d.dollarRateName || "").toUpperCase();
        return queries.some(q => s.includes(q) || n.includes(q));
    });
}

export default function IndexesSection() {
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

    const { row1, row2, national } = useMemo(() => {
        if (!data || data.length === 0) return { row1: [], row2: [], national: [] };

        // International Row 1: SPY, NASDAQ, Dow Jones
        const spy = findIndex(data, ["SPY"]);
        const nasdaq = findIndex(data, ["NASDAQ", "NDX", "IXIC", "QQQ"]);
        const dow = findIndex(data, ["DOW", "DJI", "DIA"]);

        // International Row 2: XLP, Emergentes, EWZ
        const xlp = findIndex(data, ["XLP"]);
        const emergentes = findIndex(data, ["EMERGENTES", "EEM"]);
        const ewz = findIndex(data, ["EWZ"]);

        // National: Riesgo Pais, Merval
        const riesgo = findIndex(data, ["RIESGO", "PAIS"]);
        const merval = findIndex(data, ["MERVAL", "MERV"]);

        return {
            row1: [spy, nasdaq, dow].filter(Boolean) as DualQuoteDTO[],
            row2: [xlp, emergentes, ewz].filter(Boolean) as DualQuoteDTO[],
            national: [riesgo, merval].filter(Boolean) as DualQuoteDTO[],
        };
    }, [data]);

    const IndexCard = (d: DualQuoteDTO) => {
        const isRiesgoPais = (d.dollarRateName || "").includes("Riesgo");
        // Use specific names if available, otherwise fallback
        let title = d.dollarRateName || d.usSymbol;
        if (d.usSymbol === "SPY") title = "S&P 500 (SPY)";
        if (d.usSymbol?.includes("QQQ") || d.usSymbol?.includes("NDX")) title = "NASDAQ 100";
        if (d.usSymbol?.includes("DIA") || d.usSymbol?.includes("DJI")) title = "Dow Jones";

        return (
            <Card className="index-card" sx={isRiesgoPais ? { border: "1px solid #ff9800 !important" } : {}}>
                <CardContent>
                    <Typography variant="h6" className="card-title">
                        {title}
                    </Typography>

                    <Typography className="card-text">
                        Valor: <strong>{formatUSD(d.usPriceUSD)}</strong>
                        {d.usChangePct !== undefined && d.usChangePct !== null && (
                            <span style={{ color: d.usChangePct >= 0 ? "green" : "red", marginLeft: "8px", fontSize: "0.9em" }}>
                                {d.usChangePct > 0 ? "+" : ""}{d.usChangePct}%
                            </span>
                        )}
                        {d.usChangePct === null && (
                            <span style={{ marginLeft: "8px", fontSize: "0.9em", color: "gray" }}>-</span>
                        )}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <Paper className="section-paper">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                <Box>
                    <Typography variant="h5" className="header-title">
                        Índices de Mercado
                    </Typography>
                    {updatedAt && (
                        <Typography variant="caption" color="text.secondary">
                            Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                    )}
                </Box>
                <Button
                    onClick={fetchData}
                    variant="outlined"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
                    disabled={loading}
                    className="refresh-button"
                >
                    {loading ? "Actualizando..." : "Actualizar"}
                </Button>
            </Stack>

            <Divider className="section-divider" />

            {data.length === 0 && !loading && (
                <Typography color="text.secondary">No se encontraron índices.</Typography>
            )}

            {/* International */}
            {(row1.length > 0 || row2.length > 0) && (
                <>
                    <Typography variant="subtitle1" className="section-subtitle">
                        Internacionales
                    </Typography>
                    <Stack spacing={3}>
                        {row1.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row1.map((d, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={d.usSymbol || idx} component="div">
                                        {IndexCard(d)}
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {row2.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row2.map((d, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={d.usSymbol || idx} component="div">
                                        {IndexCard(d)}
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Stack>
                </>
            )}

            {national.length > 0 && (
                <>
                    <Divider className="section-divider-soft" />
                    <Typography variant="subtitle1" className="section-subtitle">
                        Nacionales
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {national.map((d, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={d.usSymbol || idx} component="div">
                                {IndexCard(d)}
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Paper>
    );
}
