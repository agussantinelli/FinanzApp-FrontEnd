"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getIndices } from "@/services/StocksService";
import { DualQuoteDTO } from "@/types/Market";
import {
    Paper, Stack, Typography, Button, Grid, Card, CardContent,
    CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import "./styles/CedearsSection.css"; // Reusing styles as requested

function formatUSD(n?: number) {
    if (typeof n !== "number" || Number.isNaN(n)) return "—";
    // For large integers (like Riesgo Pais), don't show decimals
    const digits = n > 1000 && Number.isInteger(n) ? 0 : 2;
    return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: digits });
}

export default function IndicesSection() {
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
            console.error("❌ Error en IndicesSection:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 300_000);
        return () => clearInterval(id);
    }, [fetchData]);

    // Split data into International (first 6) and Local (rest)
    // Assuming backend sends them in order or we just take first 6 as international
    const { international, local } = useMemo(() => {
        if (!data || data.length === 0) return { international: [], local: [] };

        // As per requirement: "separando indices internacionales (los 6 primeros) y locales (merval y riesgo pais)"
        const international = data.slice(0, 6);
        const local = data.slice(6);
        return { international, local };
    }, [data]);

    const IndexCard = (d: DualQuoteDTO) => {
        const isRiesgoPais = d.dollarRateName === "Riesgo País";
        const title = d.dollarRateName || d.localSymbol || d.usSymbol;

        return (
            <Card className="cedear-card" sx={isRiesgoPais ? { border: "1px solid #ff9800" } : {}}>
                <CardContent>
                    <Typography variant="h6" className="card-title">
                        {title}
                    </Typography>

                    <Typography className="card-text" sx={{ mt: 2 }}>
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

            {/* International Indices */}
            {international.length > 0 && (
                <>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: "text.secondary" }}>
                        Internacionales
                    </Typography>
                    <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                        {international.map((d, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={d.usSymbol || idx} component="div">
                                {IndexCard(d)}
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {/* Local Indices */}
            {local.length > 0 && (
                <>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: "text.secondary" }}>
                        Locales
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {local.map((d, idx) => (
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
