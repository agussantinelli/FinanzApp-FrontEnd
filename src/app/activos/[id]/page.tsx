"use client";

import { useState } from "react";
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

import Link from "next/link";

import { useActivoDetail } from "@/hooks/useActivoDetail";
import { useAuth } from "@/hooks/useAuth";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import FloatingMessage from "@/components/ui/FloatingMessage";
import AssetOperationsHistory from "@/components/operaciones/AssetOperationsHistory";
import styles from "./styles/ActivoDetail.module.css";

import { formatPercentage } from "@/utils/format";
import { getAvatarColor } from "@/app-theme/icons-appearance";
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
    const { activo, activeRecommendations, loading } = useActivoDetail(id);
    const { valuacion } = usePortfolioData();
    const [error, setError] = useState<string | null>(null);

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
                                <Typography variant="h3" className={styles.symbolText}>
                                    {activo.symbol}
                                </Typography>
                                <Typography variant="h6" className={styles.nameText}>
                                    {activo.nombre}
                                </Typography>
                            </Box>
                        </div>

                        <Box className={styles.priceContainer}>
                            <div className={styles.priceStack}>
                                <Typography variant="h3" className={styles.priceValue}>
                                    {(activo.precioActual !== null && activo.precioActual !== undefined)
                                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: activo.moneda }).format(activo.precioActual)
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
                        </Box>
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
                            label={activo.moneda}
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
                    </div>
                </Container>
            </Box>

            {/* Content Section */}
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

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">MONEDA</Typography>
                                    <Typography variant="h6">{activo.moneda}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">ORIGEN</Typography>
                                    <Typography variant="h6">{activo.esLocal ? "Local" : "Internacional"}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">SECTOR</Typography>
                                    <Typography variant="h6">{activo.sector || "-"}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">MARKET CAP</Typography>
                                    <Typography variant="h6">
                                        {activo.marketCap
                                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 1 }).format(activo.marketCap)
                                            : "-"}
                                    </Typography>
                                </Grid>
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

                        {isAuthenticated && activo && (
                            <AssetOperationsHistory activoId={activo.id} symbol={activo.symbol} />
                        )}

                    </Grid>

                    {/* Right Column: Actions */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={0}
                            className={styles.actionsPaper}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Operar
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Gestiona tus inversiones en {activo.symbol}.
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
                                    Comprar {activo.symbol}
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
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <FloatingMessage
                open={!!error}
                message={error}
                severity="error"
                onClose={() => setError(null)}
            />
        </Box>
    );
}
