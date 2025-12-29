"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Button,
    Container,
    Divider,
    Stack,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Avatar,
    Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import IconButton from '@mui/material/IconButton';

import { toggleSeguirActivo } from "@/services/ActivosService";

import Link from "next/link";

import { useActivoDetail } from "@/hooks/useActivoDetail";
import { useAuth } from "@/hooks/useAuth";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import FloatingMessage from "@/components/ui/FloatingMessage";
import AssetOperationsHistory from "@/components/operaciones/AssetOperationsHistory";
import styles from "./styles/ActivoDetail.module.css";

import { formatPercentage } from "@/utils/format";
import { getAvatarColor } from "@/theme/icons-appearance";
import { getCurrentUser } from "@/services/AuthService";
import { createSlug } from "@/utils/slug";
import { AccionRecomendada } from "@/types/Recomendacion";

// Helpers
const getAccionLabel = (accion: AccionRecomendada) => {
    switch (accion) {
        case AccionRecomendada.CompraFuerte: return "Compra Fuerte";
        case AccionRecomendada.Comprar: return "Comprar";
        case AccionRecomendada.Mantener: return "Mantener";
        case AccionRecomendada.Vender: return "Vender";
        default: return "Desconocido";
    }
};

const getAccionColor = (accion: AccionRecomendada) => {
    switch (accion) {
        case AccionRecomendada.CompraFuerte: return "success";
        case AccionRecomendada.Comprar: return "success";
        case AccionRecomendada.Mantener: return "warning";
        case AccionRecomendada.Vender: return "error";
        default: return "default";
    }
};

export default function ActivoDetalle() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { isAuthenticated } = useAuth();
    const { activo, activeRecommendations, loading, updateActivoState } = useActivoDetail(id);
    const { valuacion } = usePortfolioData();
    const [error, setError] = useState<string | null>(null);

    const handleToggleSeguir = async () => {
        if (!activo) return;
        const user = getCurrentUser();
        if (!user) {
            router.push("/auth/login");
            return;
        }

        // Optimistic Update
        const updatedAsset = { ...activo, loSigo: !activo.loSigo };
        updateActivoState(updatedAsset);

        try {
            await toggleSeguirActivo(activo.id);
        } catch (error) {
            console.error("Error toggling follow:", error);
            // Revert on error
            updateActivoState(activo);
        }
    };

    const handleOperation = (tipo: "COMPRA" | "VENTA") => {
        const user = getCurrentUser();
        if (!user) {
            router.push("/auth/login");
            return;
        }

        if (tipo === "VENTA" && activo && valuacion) {
            const hasAsset = valuacion.activos.some(a => a.symbol === activo.symbol);
            if (!hasAsset) {
                setError(`No tienes ${activo.symbol} para vender.`);
                return;
            }
        }

        if (activo) {
            router.push(`/registrar-operacion?activoId=${activo.id}&tipo=${tipo}`);
        }
    };


    const [dolarPrices, setDolarPrices] = useState<{ compra: number, venta: number } | null>(null);
    const [riesgoValue, setRiesgoValue] = useState<number | null>(null);

    useEffect(() => {
        if (activo?.symbol && typeof window !== 'undefined') {
            const cacheDolar = localStorage.getItem('DOLAR_PRICES_CACHE');
            if (cacheDolar) {
                try {
                    const parsed = JSON.parse(cacheDolar);
                    const specific = parsed[activo.symbol];
                    if (specific) {
                        setDolarPrices(specific);
                    }
                } catch (e) {
                    console.error("Error parsing dolar prices", e);
                }
            }

            if (activo.symbol === "EMBI_AR") {
                const cacheRiesgo = localStorage.getItem('RIESGO_PAIS_CACHE');
                if (cacheRiesgo) {
                    setRiesgoValue(Number(cacheRiesgo));
                }
            }
        }
    }, [activo?.symbol]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (!activo) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="text.secondary">
                    Activo no encontrado
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => router.back()}
                    sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                >
                    Volver al Mercado
                </Button>
            </Container>
        );
    }

    const brandColor = getAvatarColor(activo.tipo);
    const isMoneda = activo.tipo === 'Moneda' || activo.tipo === 'Divisa';
    const isRiesgoPais = activo.symbol === "EMBI_AR";

    const precioCompra = dolarPrices?.compra ?? activo.precioCompra;
    const precioVenta = dolarPrices?.venta ?? activo.precioVenta;

    return (
        <Box className={styles.mainBox}>
            {/* Hero Section */}
            <Box className={styles.heroSection}>
                {/* Decorative generic background blob */}
                <Box
                    className={styles.decorativeBlob}
                    sx={{ bgcolor: brandColor }}
                />

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.back()}
                        className={styles.backButton}
                    >
                        Volver
                    </Button>

                    <div className={styles.heroHeaderStack}>
                        <div className={styles.assetIdentityStack}>
                            <Avatar
                                className={styles.avatar}
                                sx={{
                                    bgcolor: brandColor,
                                    boxShadow: `0 8px 24px ${brandColor}40`
                                }}
                            >
                                {activo.symbol.substring(0, 1)}
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="h3" className={styles.symbolText}>
                                        {activo.symbol}
                                    </Typography>
                                    {isAuthenticated && (
                                        <IconButton onClick={handleToggleSeguir} sx={{ color: 'white' }}>
                                            {activo.loSigo ? <StarIcon color="warning" /> : <StarBorderIcon />}
                                        </IconButton>
                                    )}
                                </Box>
                                <Typography variant="h6" className={styles.nameText}>
                                    {activo.nombre}
                                </Typography>
                            </Box>
                        </div>

                        {!isMoneda && (
                            <Box className={styles.priceContainer}>
                                {isRiesgoPais ? (
                                    <div className={styles.priceStack}>
                                        <Typography variant="h3" className={styles.priceValue}>
                                            {Math.round(riesgoValue ?? activo.precioActual ?? 0)} pbs
                                        </Typography>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.priceStack}>
                                            <Typography variant="h3" className={styles.priceValue}>
                                                {(activo.precioActual !== null && activo.precioActual !== undefined)
                                                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: activo.monedaBase }).format(activo.precioActual)
                                                    : '$ --'
                                                }
                                            </Typography>
                                            <Chip
                                                label={`${(activo.variacion24h ?? 0) >= 0 ? '+' : ''}${formatPercentage(activo.variacion24h)}%`}
                                                size="medium"
                                                className={styles.variationChip}
                                                sx={{
                                                    bgcolor: (activo.variacion24h ?? 0) >= 0 ? 'success.light' : 'error.light',
                                                }}
                                            />
                                        </div>
                                        <Typography variant="body2" className={styles.updateText}>
                                            {activo.ultimaActualizacion
                                                ? `Actualizado: ${new Date(activo.ultimaActualizacion).toLocaleString()}`
                                                : 'Actualización pendiente'
                                            }
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </div>

                    <div className={styles.tagsStack}>
                        <Chip
                            label={activo.tipo}
                            className={styles.tagChip}
                            sx={{
                                bgcolor: `${brandColor}20`,
                                color: brandColor,
                            }}
                        />
                        <Chip
                            label={activo.monedaBase}
                            variant="outlined"
                            className={styles.tagChipOutlined}
                        />
                        {activo.esLocal && (
                            <Chip
                                label="ARG"
                                variant="outlined"
                                color="info"
                                className={styles.tagChipOutlined}
                            />
                        )}

                        {activo.contraparteSymbol && (
                            <Chip
                                icon={<SwapHorizIcon />}
                                label={activo.tipoRelacion === 'CEDEAR (ARG)'
                                    ? `Ver CEDEAR (${activo.contraparteSymbol})`
                                    : `Ver Acción Original (${activo.contraparteSymbol})`}
                                onClick={() => router.push(`/activos/${activo.contraparteSymbol}`)}
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer',
                                    borderColor: 'secondary.main',
                                    color: 'secondary.main',
                                    '&:hover': {
                                        bgcolor: 'secondary.main',
                                        color: 'white'
                                    }
                                }}
                            />
                        )}
                    </div>
                </Container>
            </Box>

            <Container maxWidth="lg" className={styles.contentContainer}>
                <Grid container spacing={4}>
                    {/* Left Column: Details */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper
                            elevation={0}
                            className={styles.detailPaper}
                        >
                            <div className={styles.sectionHeaderStack}>
                                <InfoOutlinedIcon color="action" />
                                <Typography variant="h6" fontWeight="bold">
                                    Sobre este activo
                                </Typography>
                            </div>
                            <Typography variant="body1" paragraph className={styles.descriptionText}>
                                {activo.descripcion}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={2}>

                                <Grid size={{ xs: 6 }}>
                                    <div className={styles.infoCard}>
                                        <Typography className={styles.infoLabel}>ORIGEN</Typography>
                                        <Typography className={styles.infoValue}>{activo.esLocal ? "Local" : "Internacional"}</Typography>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <div className={styles.infoCard}>
                                        <Typography className={styles.infoLabel}>SECTOR</Typography>
                                        <Typography className={styles.infoValue}>{activo.sector || "-"}</Typography>
                                    </div>
                                </Grid>
                                {!isMoneda && !isRiesgoPais && (
                                    <Grid size={{ xs: 6 }}>
                                        <div className={styles.infoCard}>
                                            <Typography className={styles.infoLabel}>MARKET CAP</Typography>
                                            <Typography className={styles.infoValue}>
                                                {activo.marketCap
                                                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 1 }).format(activo.marketCap)
                                                    : "-"}
                                            </Typography>
                                        </div>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>

                        {isAuthenticated && activeRecommendations && activeRecommendations.length > 0 && (
                            <Paper
                                elevation={0}
                                className={styles.detailPaper}
                                sx={{ mt: 3 }}
                            >
                                <div className={styles.sectionHeaderStack}>
                                    <LightbulbIcon color="warning" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Recomendaciones de Expertos
                                    </Typography>
                                </div>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Análisis vigentes que incluyen este activo.
                                </Typography>

                                <Stack spacing={2}>
                                    {activeRecommendations.map((rec) => (
                                        <Box key={rec.summary.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                component={Link}
                                                href={`/recomendaciones/${createSlug(rec.summary.titulo)}`}
                                                sx={{
                                                    textDecoration: 'none',
                                                    color: 'primary.main',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {rec.summary.titulo}
                                            </Typography>

                                            <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                                                Por {rec.summary.autorNombre} • {new Date(rec.summary.fecha).toLocaleDateString()}
                                            </Typography>

                                            {rec.detail && (
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography variant="caption" display="block" fontWeight="bold">Estrategia</Typography>
                                                        <Chip
                                                            label={getAccionLabel(rec.detail.accion)}
                                                            color={getAccionColor(rec.detail.accion) as any}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography variant="caption" display="block" fontWeight="bold">Target</Typography>
                                                        <Typography variant="body2" fontWeight="bold" color="success.main">
                                                            ${rec.detail.precioObjetivo?.toFixed(2)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography variant="caption" display="block" fontWeight="bold">Stop Loss</Typography>
                                                        <Typography variant="body2" fontWeight="bold" color="error.main">
                                                            ${rec.detail.stopLoss?.toFixed(2)}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        )}

                        {isAuthenticated && activo && !isMoneda && !isRiesgoPais && (
                            <AssetOperationsHistory activoId={activo.id} symbol={activo.symbol} />
                        )}

                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        {!isRiesgoPais && (
                            <Paper
                                elevation={0}
                                className={styles.actionsPaper}
                            >
                                {isMoneda ? (
                                    <>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Cotización
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Valores de referencia para {activo!.symbol}.
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight="bold">PRECIO COMPRA</Typography>
                                                <Typography variant="h4" fontWeight="bold" color="primary.main">
                                                    {precioCompra
                                                        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precioCompra)
                                                        : '-'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight="bold">PRECIO VENTA</Typography>
                                                <Typography variant="h4" fontWeight="bold" color="primary.main">
                                                    {precioVenta
                                                        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precioVenta)
                                                        : '-'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Operar
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Gestiona tus inversiones en {activo!.symbol}.
                                        </Typography>

                                        <div className={styles.actionsStack}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                startIcon={<TrendingUpIcon />}
                                                className={styles.primaryActionButton}
                                                onClick={() => handleOperation("COMPRA")}
                                                sx={{
                                                    bgcolor: "success.main",
                                                    "&:hover": { bgcolor: "success.dark" },
                                                }}
                                            >
                                                Comprar {activo!.symbol}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="large"
                                                startIcon={<AttachMoneyIcon />}
                                                className={styles.secondaryActionButton}
                                                onClick={() => handleOperation("VENTA")}
                                            >
                                                Vender
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Paper>
                        )}
                    </Grid>
                </Grid >
            </Container >

            <FloatingMessage
                open={!!error}
                message={error}
                severity="error"
                onClose={() => setError(null)}
            />
        </Box >
    );
}
