"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Stack,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Avatar,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { ActivoDTO } from "@/types/Activo";
import { getActivoById, getActivoFromCache } from "@/services/ActivosService";

import styles from "./styles/ActivoDetail.module.css";

import { getAvatarColor } from "@/utils/colorUtils";
import { getCurrentUser } from "@/services/AuthService";

export default function ActivoDetalle() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [activo, setActivo] = useState<ActivoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadActivo = async () => {
            try {
                // Try to get from cache first
                const cached = getActivoFromCache(id);
                if (cached) {
                    setActivo(cached);
                    setLoading(false);
                    return;
                }

                // If not in cache, fetch from backend (by ID, not all)
                const data = await getActivoById(id);
                setActivo(data);
            } catch (error) {
                console.error("Error loading asset details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadActivo();
        }
    }, [id]);

    const handleOperation = () => {
        const user = getCurrentUser();
        if (!user) {
            router.push("/auth/login");
            return;
        }
        // TODO: Implement actual buy/sell modal or navigation
        console.log("Operación autorizada para:", user.email);
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
                                    label={`${(activo.variacion24h ?? 0) >= 0 ? '+' : ''}${(activo.variacion24h ?? 0).toFixed(2)}%`}
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
                    <Grid item xs={12} md={8}>
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
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">MONEDA</Typography>
                                    <Typography variant="h6">{activo.moneda}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">ORIGEN</Typography>
                                    <Typography variant="h6">{activo.esLocal ? "Local" : "Internacional"}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">SECTOR</Typography>
                                    <Typography variant="h6">{activo.sector || "-"}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">MARKET CAP</Typography>
                                    <Typography variant="h6">
                                        {activo.marketCap
                                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 1 }).format(activo.marketCap)
                                            : "-"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                    </Grid>

                    {/* Right Column: Actions */}
                    <Grid item xs={12} md={4}>
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
                                    onClick={handleOperation}
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
                                    onClick={handleOperation}
                                >
                                    Vender
                                </Button>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
