"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getIndices } from "@/services/StocksService";
import { DualQuoteDTO } from "@/types/Market";
import {
    Paper, Stack, Typography, Button, Grid, Card, CardContent,
    CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
// Reutilizamos estilos o definimos los propios que imitan a AccionesAR
import "./styles/IndexesSection.css";

function formatARS(val?: number) {
    if (val === undefined || val === null || isNaN(val)) return "—";
    return val.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function formatUSD(val?: number) {
    if (val === undefined || val === null || isNaN(val)) return "—";
    // Si es mayor a 1000 (como índices), quitamos decimales para limpieza visual
    const digits = val > 1000 ? 0 : 2;
    return val.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits });
}

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
            national: [riesgo, merval].filter(Boolean) as DualQuoteDTO[],
        };
    }, [data]);

    const IndexCard = (d: DualQuoteDTO) => {
        // Detectar si es Riesgo País para mostrar diseño único
        const isRiesgo = d.localSymbol === "RIESGO" || d.dollarRateName === "Puntos";

        // Títulos Amigables
        let title = d.dollarRateName || d.usSymbol;
        if (d.usSymbol?.includes("GSPC") || d.usSymbol?.includes("SPY")) title = "S&P 500";
        if (d.usSymbol?.includes("IXIC") || d.usSymbol?.includes("NDX")) title = "NASDAQ 100";
        if (d.usSymbol?.includes("DIA")) title = "Dow Jones";
        if (d.localSymbol === "RIESGO") title = "Riesgo País";

        // --- DISEÑO ESPECIAL: RIESGO PAÍS (Único Valor) ---
        if (isRiesgo) {
            return (
                <Card className="acciones-card risk-card">
                    <CardContent sx={{ textAlign: 'center', padding: '24px !important' }}>
                        <Typography variant="h6" className="card-title" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                            {Math.round(d.usPriceUSD)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Puntos Básicos (pbs)
                        </Typography>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="acciones-card">
                <CardContent>
                    <Typography variant="h6" className="card-title">
                        {title}
                    </Typography>

                    <Typography variant="caption" className="card-subtitle">
                        {d.dollarRateName === 'ARS' ? 'Índice Local' : 'Índice Internacional'}
                    </Typography>

                    <Typography className="card-symbol">
                        {d.localSymbol}
                    </Typography>

                    <Typography className="card-text">
                        En Pesos: <strong>{formatARS(d.usPriceARS)}</strong>
                        {d.usChangePct !== undefined && d.usChangePct !== null && (
                            <span style={{ color: d.usChangePct >= 0 ? "green" : "red", marginLeft: "8px", fontSize: "0.9em" }}>
                                {d.usChangePct > 0 ? "+" : ""}{d.usChangePct}%
                            </span>
                        )}
                    </Typography>

                    <Typography className="card-text">
                        En USD/Pts: <strong>{formatUSD(d.usPriceUSD)}</strong>
                        {d.usChangePct !== undefined && d.usChangePct !== null && (
                            <span style={{ color: d.usChangePct >= 0 ? "green" : "red", marginLeft: "8px", fontSize: "0.9em" }}>
                                {d.usChangePct > 0 ? "+" : ""}{d.usChangePct}%
                            </span>
                        )}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" className="card-rate">
                        Ref: {d.dollarRateName} ({formatARS(d.usedDollarRate)})
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
                        Tablero de Índices
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
                <Typography color="text.secondary">Cargando índices de mercado...</Typography>
            )}

            {(row1.length > 0 || row2.length > 0) && (
                <>
                    <Typography variant="subtitle1" className="section-subtitle">
                        Wall Street & Emergentes
                    </Typography>
                    <Stack spacing={3}>
                        {row1.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row1.map((d, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={d.usSymbol || idx}>
                                        {IndexCard(d)}
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {row2.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row2.map((d, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={d.usSymbol || idx}>
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
                        Argentina
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {national.map((d, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={d.usSymbol || idx}>
                                {IndexCard(d)}
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Paper>
    );
}