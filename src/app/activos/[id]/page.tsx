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

// Helper for brand colors (duplicated from main page for self-containment)
const getAvatarColor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
        case 'accion':
        case 'acciones':
            return "#2196f3"; // Blue
        case 'cedear':
        case 'cedears':
            return "#9c27b0"; // Purple
        case 'bono':
        case 'bonos':
            return "#4caf50"; // Green
        case 'obligacion negociable':
        case 'on':
            return "#ff9800"; // Orange
        case 'fci':
            return "#00bcd4"; // Cyan
        default:
            return "#757575"; // Grey
    }
};

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
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: "background.paper",
                    pt: 6,
                    pb: 8,
                    borderRadius: "0 0 40px 40px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Decorative generic background blob */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        bgcolor: brandColor,
                        opacity: 0.05,
                        zIndex: 0
                    }}
                />

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.back()}
                        sx={{ mb: 4, color: "text.secondary", textTransform: "none" }}
                    >
                        Volver
                    </Button>

                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={4}>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: brandColor,
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    boxShadow: `0 8px 24px ${brandColor}40`
                                }}
                            >
                                {activo.symbol.substring(0, 1)}
                            </Avatar>
                            <Box>
                                <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: "-1px" }}>
                                    {activo.symbol}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                    {activo.nombre}
                                </Typography>
                            </Box>
                        </Stack>

                        <Box>
                            <Stack direction="row" alignItems="baseline" spacing={2} justifyContent="flex-end">
                                <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: "-1px" }}>
                                    {(activo.precioActual !== null && activo.precioActual !== undefined)
                                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: activo.moneda }).format(activo.precioActual)
                                        : '$ --'
                                    }
                                </Typography>
                                {(activo.variacion24h !== null && activo.variacion24h !== undefined) && (
                                    <Chip
                                        label={`${activo.variacion24h >= 0 ? '+' : ''}${activo.variacion24h.toFixed(2)}%`}
                                        size="medium"
                                        sx={{
                                            bgcolor: activo.variacion24h >= 0 ? 'success.light' : 'error.light',
                                            color: 'white',
                                            fontWeight: 700,
                                            height: 32,
                                            borderRadius: "8px"
                                        }}
                                    />
                                )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 1 }}>
                                {activo.ultimaActualizacion
                                    ? `Actualizado: ${new Date(activo.ultimaActualizacion).toLocaleString()}`
                                    : 'Actualización pendiente'
                                }
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: 3, ml: { md: 13 } }}>
                        <Chip
                            label={activo.tipo}
                            sx={{
                                bgcolor: `${brandColor}20`,
                                color: brandColor,
                                fontWeight: 700,
                                height: 28,
                                borderRadius: "6px"
                            }}
                        />
                        <Chip
                            label={activo.moneda}
                            variant="outlined"
                            sx={{ fontWeight: 600, height: 28, borderRadius: "6px" }}
                        />
                        {activo.esLocal && (
                            <Chip
                                label="ARG"
                                variant="outlined"
                                color="info"
                                sx={{ fontWeight: 600, height: 28, borderRadius: "6px" }}
                            />
                        )}
                    </Stack>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxWidth="lg" sx={{ mt: -4 }}>
                <Grid container spacing={4}>
                    {/* Left Column: Details */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: "24px",
                                border: "1px solid",
                                borderColor: "divider",
                                mb: 4
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <InfoOutlinedIcon color="action" />
                                <Typography variant="h6" fontWeight="bold">
                                    Sobre este activo
                                </Typography>
                            </Stack>
                            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}>
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
                            sx={{
                                p: 3,
                                borderRadius: "24px",
                                border: "1px solid",
                                borderColor: "divider",
                                position: "sticky",
                                top: 24
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Operar
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Gestiona tus inversiones en {activo.symbol}.
                            </Typography>

                            <Stack spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<TrendingUpIcon />}
                                    sx={{
                                        bgcolor: "success.main",
                                        "&:hover": { bgcolor: "success.dark" },
                                        borderRadius: "12px",
                                        py: 1.5,
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        fontSize: "1rem"
                                    }}
                                >
                                    Comprar {activo.symbol}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<AttachMoneyIcon />}
                                    sx={{
                                        color: "text.primary",
                                        borderColor: "divider",
                                        borderRadius: "12px",
                                        py: 1.5,
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        "&:hover": { borderColor: "text.primary", bgcolor: "rgba(0,0,0,0.02)" }
                                    }}
                                >
                                    Vender
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
