"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Paper, Typography, Button, Grid, Card, CardContent,
    CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DualQuoteDTO } from "@/types/Market";
import { getIndices } from "@/services/StocksService";
import styles from "./styles/IndexesSection.module.css";

function formatARS(val?: number | null) {
    if (val === undefined || val === null || isNaN(val)) return "—";
    return val.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function formatUSD(val?: number | null) {
    if (val === undefined || val === null || isNaN(val)) return "—";
    const digits = val > 1000 ? 0 : 2;
    return val.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits });
}

function findIndex(data: DualQuoteDTO[], queries: string[]) {
    return data.find(d => {
        const s = (d.usSymbol || "").toUpperCase();
        const l = (d.localSymbol || "").toUpperCase();
        const n = (d.dollarRateName || "").toUpperCase();
        return queries.some(q => s.includes(q) || l.includes(q) || n.includes(q));
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
            national: [merval, riesgo].filter(Boolean) as DualQuoteDTO[],
        };
    }, [data]);

    const IndexCard = (d: DualQuoteDTO) => {
        const isRiesgo = d.localSymbol === "RIESGO" || d.dollarRateName === "Puntos";

        let title = d.usSymbol;
        if (d.usSymbol?.includes("GSPC") || d.usSymbol?.includes("SPY")) title = "S&P 500";
        if (d.usSymbol?.includes("IXIC") || d.usSymbol?.includes("NDX")) title = "NASDAQ 100";
        if (d.usSymbol?.includes("DIA")) title = "Dow Jones";
        if (d.usSymbol?.includes("XLP")) title = "Consumo (XLP)";
        if (d.usSymbol?.includes("EEM")) title = "Emergentes (EEM)";
        if (d.usSymbol?.includes("EWZ")) title = "Brasil (EWZ)";
        if (d.localSymbol === "RIESGO") title = "Riesgo País";
        if (d.localSymbol === "MERVAL" || d.localSymbol === "MERV" || d.localSymbol === "^MERV" || d.usSymbol === "^MERV") title = "Merval";

        if (isRiesgo) {
            return (
                <Card className={`${styles.accionesCard} ${styles.riskCard}`}>
                    <CardContent className={styles.riskCardContent}>
                        <Typography variant="h6" className={styles.cardTitleRisk}>
                            {title}
                        </Typography>
                        <Typography variant="caption" className={`${styles.cardSubtitleRisk} ${styles.riskSubtitleBlock}`}>
                            Índice Nacional
                        </Typography>
                        <Typography variant="h3" className={styles.riskValue}>
                            {Math.round(d.usPriceUSD)}
                        </Typography>
                        <Typography variant="caption" className={styles.cardSubtitleRisk}>
                            Puntos Básicos (pbs)
                        </Typography>
                    </CardContent>
                </Card>
            );
        }

        const isLocalIndex = d.dollarRateName === 'ARS';
        const labelArs = isLocalIndex ? "Valor (ARS)" : "CEDEAR (ARS)";
        const labelUsd = isLocalIndex ? "Valor (USD)" : "Indice USA (USD)";

        return (
            <Card className={styles.accionesCard}>
                <CardContent>
                    <Typography variant="h6" className={styles.cardTitle}>
                        {title}
                    </Typography>

                    <Typography variant="caption" className={styles.cardSubtitle}>
                        {isLocalIndex ? 'Índice Nacional' : 'Índice Internacional'}
                    </Typography>

                    <Typography className={styles.cardSymbol}>
                        {d.localSymbol}
                    </Typography>

                    <Typography className={styles.cardText}>
                        {labelArs}: <strong>{formatARS(d.usPriceARS)}</strong>
                        {d.usChangePct !== undefined && d.usChangePct !== null && (
                            <span className={`${styles.changePercent} ${d.usChangePct >= 0 ? styles.positive : styles.negative}`}>
                                {d.usChangePct > 0 ? "+" : ""}{d.usChangePct}%
                            </span>
                        )}
                    </Typography>

                    <Typography className={styles.cardText}>
                        {labelUsd}: <strong>{formatUSD(d.usPriceUSD)}</strong>
                        {d.usChangePct !== undefined && d.usChangePct !== null && (
                            <span className={`${styles.changePercent} ${d.usChangePct >= 0 ? styles.positive : styles.negative}`}>
                                {d.usChangePct > 0 ? "+" : ""}{d.usChangePct}%
                            </span>
                        )}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" className={styles.cardRate}>
                        Ref: {d.dollarRateName} ({formatARS(d.usedDollarRate)})
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <Paper className={styles.sectionPaper}>
            <div className={styles.headerContainer}>
                <Box>
                    <Typography variant="h5" className={styles.headerTitle}>
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
                    className={styles.refreshButton}
                >
                    {loading ? "Actualizando..." : "Actualizar"}
                </Button>
            </div>

            <Divider className={styles.sectionDivider} />

            {data.length === 0 && !loading && (
                <Typography color="text.secondary">Cargando índices de mercado...</Typography>
            )}

            {(row1.length > 0 || row2.length > 0) && (
                <>
                    <Typography variant="subtitle1" className={styles.sectionSubtitle}>
                        Wall Street & Emergentes
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={3}>
                        {row1.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row1.map((d, idx) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.usSymbol || idx}>
                                        {IndexCard(d)}
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {row2.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row2.map((d, idx) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.usSymbol || idx}>
                                        {IndexCard(d)}
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </>
            )}

            {national.length > 0 && (
                <>
                    <Divider className={styles.sectionDividerSoft} />
                    <Typography variant="subtitle1" className={styles.sectionSubtitle}>
                        Argentina
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {national.map((d, idx) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.usSymbol || idx}>
                                {IndexCard(d)}
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Paper>
    );
}