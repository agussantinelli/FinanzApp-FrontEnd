"use client";

import * as React from "react";
import Link from "next/link";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Stack,
    Chip,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Skeleton,
    TableSortLabel,
    Button
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { getPortafolioValuado } from "@/services/PortafolioService";
import { PortafolioValuadoDTO } from "@/types/Portafolio";
import styles from "@/app/portfolio/styles/Portfolio.module.css"; // Reuse styles
import { formatARS, formatPercentage, formatUSD, formatQuantity } from "@/utils/format";
import { CurrencyToggle } from "@/components/common/CurrencyToggle";
import PortfolioCompositionChart from "@/components/portfolio/PortfolioCompositionChart";
import { usePortfolioSort, OrderBy } from "@/hooks/usePortfolioSort";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AdminPortfolioView() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [valuacion, setValuacion] = React.useState<PortafolioValuadoDTO | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [currency, setCurrency] = React.useState<'ARS' | 'USD'>('USD');

    React.useEffect(() => {
        if (!id) return;
        setLoading(true);
        getPortafolioValuado(id)
            .then(data => {
                setValuacion(data);
            })
            .catch(err => console.error("Error loading portfolio details:", err))
            .finally(() => setLoading(false));
    }, [id]);

    // Sorting State
    const { order, orderBy, handleRequestSort, sortedActivos } = usePortfolioSort({
        activos: valuacion?.activos,
        currency,
        totalPesos: valuacion?.totalPesos,
        totalDolares: valuacion?.totalDolares
    });

    if (loading) {
        return (
            <RoleGuard allowedRoles={['Administrador']}>
                <Box className={styles.container}>
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
                </Box>
            </RoleGuard>
        );
    }

    if (!valuacion) {
        return (
            <RoleGuard allowedRoles={['Administrador']}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5">Portafolio no encontrado</Typography>
                    <Button onClick={() => router.back()} sx={{ mt: 2 }} variant="outlined">Volver</Button>
                </Box>
            </RoleGuard>
        );
    }

    return (
        <RoleGuard allowedRoles={['Administrador']}>
            <Box className={styles.container}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    sx={{ mb: 2 }}
                >
                    Volver al Panel
                </Button>

                <Grid container spacing={3}>
                    {/* HEADER */}
                    <Grid xs={12}>
                        <Paper className={styles.headerPaper}>
                            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                                <Box>
                                    <Typography variant="h4" className={styles.headerTitle} sx={{ fontWeight: 700 }}>
                                        {valuacion.nombre} <Chip label="Vista Admin" size="small" color="secondary" variant="outlined" />
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {valuacion.descripcion || "Sin descripción"}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        {valuacion.esPrincipal && <Chip label="Principal" color="info" size="small" />}
                                        {valuacion.esDestacado && <Chip label="Destacado" color="warning" size="small" />}
                                    </Stack>
                                </Box>
                                <Box>
                                    <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* CARDS */}
                    <Grid xs={12} md={4}>
                        <Paper className={`${styles.card} ${styles.highlightCard}`}>
                            <Typography variant="caption" color="text.secondary">Valor Total ({currency})</Typography>
                            <Typography variant="h4" className={styles.cardValue}>
                                {currency === 'ARS' ? formatARS(valuacion.totalPesos) : formatUSD(valuacion.totalDolares)}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Paper className={styles.card}>
                            <Typography variant="caption" color="text.secondary">Ganancia/Pérdida ({currency})</Typography>
                            <Typography variant="h4" className={`${styles.cardValue} ${(currency === 'ARS' ? valuacion.gananciaPesos : valuacion.gananciaDolares) >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                                {(() => {
                                    let gain = currency === 'ARS' ? valuacion.gananciaPesos : valuacion.gananciaDolares;
                                    // Same fix logic as main page if needed, simplified here
                                    return (gain > 0 ? "+" : "") + (currency === 'ARS' ? formatARS(gain) : formatUSD(gain));
                                })()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Variation: {formatPercentage(currency === 'ARS' ? valuacion.variacionPorcentajePesos : valuacion.variacionPorcentajeDolares)}%
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid xs={12} md={4}>
                        <Paper className={styles.card}>
                            <Typography variant="caption" color="text.secondary">Activos en Cartera</Typography>
                            <Typography variant="h4" className={styles.cardValue}>
                                {valuacion.activos?.length ?? 0}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* CHART */}
                    <Grid xs={12}>
                        <PortfolioCompositionChart
                            activos={valuacion.activos || []}
                            totalPesos={valuacion.totalPesos}
                            totalDolares={valuacion.totalDolares}
                            currency={currency}
                        />
                    </Grid>

                    {/* TABLE */}
                    <Grid xs={12}>
                        <Paper className={styles.tablePaper}>
                            <Typography variant="h6" className={styles.sectionTitle} gutterBottom>
                                Detalle de Activos
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        {[
                                            { id: 'symbol', label: 'Ticker' },
                                            { id: 'moneda', label: 'Moneda' },
                                            { id: 'cantidad', label: 'Cantidad' },
                                            { id: 'ppc', label: `PPC (${currency})` },
                                            { id: 'totalCost', label: `Costo Total (${currency})` },
                                            { id: 'price', label: `Precio Actual (${currency})` },
                                            { id: 'currentValue', label: `Valor Actual (${currency})` },
                                            { id: 'percentage', label: '% Cartera' },
                                            { id: 'performance', label: 'Rendimiento' },
                                        ].map((headCell) => (
                                            <TableCell
                                                key={headCell.id}
                                                sortDirection={orderBy === headCell.id ? order : false}
                                            >
                                                <TableSortLabel
                                                    active={orderBy === headCell.id}
                                                    direction={orderBy === headCell.id ? order : 'asc'}
                                                    onClick={() => handleRequestSort(headCell.id as OrderBy)}
                                                >
                                                    {headCell.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedActivos.map(a => {
                                        const assetCurrency = a.moneda || "ARS";
                                        const isAssetUSD = assetCurrency === 'USD' || assetCurrency === 'USDT' || assetCurrency === 'USDC';
                                        const ccl = (valuacion.totalDolares && valuacion.totalPesos) ? valuacion.totalPesos / valuacion.totalDolares : 1;

                                        // Normalize Prices (Simplified logic reuse)
                                        let priceARS = 0, priceUSD = 0, ppcARS = 0, ppcUSD = 0;
                                        if (isAssetUSD) {
                                            priceUSD = a.precioActual; priceARS = priceUSD * ccl;
                                            ppcUSD = a.precioPromedioCompra; ppcARS = ppcUSD * ccl;
                                        } else {
                                            priceARS = a.precioActual; priceUSD = priceARS / ccl;
                                            ppcARS = a.precioPromedioCompra; ppcUSD = ppcARS / ccl;
                                        }

                                        const priceToShow = currency === 'ARS' ? priceARS : priceUSD;
                                        const ppcToShow = currency === 'ARS' ? ppcARS : ppcUSD;
                                        const totalCostToShow = ppcToShow * a.cantidad;
                                        const totalToShow = priceToShow * a.cantidad; // Approximation

                                        // Actually use valorizadoNativo logic from hook/helpers if available, 
                                        // but calculating simply here for display consistency with main page logic used there.

                                        const varPct = a.precioPromedioCompra > 0 ? ((a.precioActual - a.precioPromedioCompra) / a.precioPromedioCompra * 100) : 0;

                                        return (
                                            <TableRow key={a.activoId}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{a.symbol}</TableCell>
                                                <TableCell><Chip label={assetCurrency} size="small" variant="outlined" /></TableCell>
                                                <TableCell>{formatQuantity(a.cantidad)}</TableCell>
                                                <TableCell>{currency === 'ARS' ? formatARS(ppcToShow) : formatUSD(ppcToShow)}</TableCell>
                                                <TableCell>{currency === 'ARS' ? formatARS(totalCostToShow) : formatUSD(totalCostToShow)}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{currency === 'ARS' ? formatARS(priceToShow) : formatUSD(priceToShow)}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{currency === 'ARS' ? formatARS(totalToShow) : formatUSD(totalToShow)}</TableCell>
                                                <TableCell>{formatPercentage(a.porcentajeCartera)}%</TableCell>
                                                <TableCell sx={{ color: varPct >= 0 ? 'success.main' : 'error.main' }}>
                                                    {varPct > 0 ? "+" : ""}{formatPercentage(varPct)}%
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {sortedActivos.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">Este portafolio no tiene activos.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </RoleGuard>
    );
}
