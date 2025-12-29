"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box, Typography, Paper, Grid, Chip, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, CircularProgress, Alert, Container, Stack, Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { RecomendacionDTO, RecomendacionDetalleDTO, AccionRecomendada, EstadoRecomendacion } from '@/types/Recomendacion';
import { getRecomendacionById, getRecomendaciones, getRecomendacionesActivasPendientes, aprobarRecomendacion, rechazarRecomendacion } from '@/services/RecomendacionesService';
import { createSlug } from '@/utils/slug';
import { useAuth } from "@/hooks/useAuth";
import { RolUsuario } from "@/types/Usuario";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import { colors } from '@/app-theme/design-tokens';
import styles from './styles/RecomendacionDetail.module.css';
import { RoleGuard } from "@/components/auth/RoleGuard";

// Helper for Action Action Colors
const getAccionColor = (accion: AccionRecomendada) => {
    switch (accion) {
        case AccionRecomendada.CompraFuerte: return "success.main";
        case AccionRecomendada.Comprar: return "success.light";
        case AccionRecomendada.Mantener: return "warning.main";
        case AccionRecomendada.Vender: return "error.main";
        default: return "text.primary";
    }
};

const getAccionLabel = (accion: AccionRecomendada) => {
    switch (accion) {
        case AccionRecomendada.CompraFuerte: return "Compra Fuerte";
        case AccionRecomendada.Comprar: return "Comprar";
        case AccionRecomendada.Mantener: return "Mantener";
        case AccionRecomendada.Vender: return "Vender";
        default: return "Desconocido";
    }
};

const getRiesgoLabel = (r: number | string) => {
    const val = Number(r);
    switch (val) {
        case 1: return "Conservador";
        case 2: return "Moderado";
        case 3: return "Agresivo";
        case 4: return "Especulativo";
        default: return String(r);
    }
};

const getRiesgoColor = (r: number | string) => {
    const val = Number(r);
    switch (val) {
        case 1: return "success";
        case 2: return "info";
        case 3: return "warning";
        case 4: return "error";
        default: return "default";
    }
};

const getHorizonteStyle = (h: string | number) => {
    // Mapping matches Card logic, handling both Enum number or String if API varies
    const val = String(h);
    if (val === "1" || val === "Intradia") return { color: colors.neon.magenta, borderColor: colors.neon.magenta, boxShadow: `0 0 5px ${colors.neon.magenta}40` };
    if (val === "2" || val === "CortoPlazo") return { color: colors.neon.cyan, borderColor: colors.neon.cyan, boxShadow: `0 0 5px ${colors.neon.cyan}40` };
    if (val === "3" || val === "MedianoPlazo") return { color: colors.neon.orange, borderColor: colors.neon.orange, boxShadow: `0 0 5px ${colors.neon.orange}40` };
    if (val === "4" || val === "LargoPlazo") return { color: colors.neon.green, borderColor: colors.neon.green, boxShadow: `0 0 5px ${colors.neon.green}40` };
    return { color: colors.textPrimary, borderColor: colors.textPrimary };
};

const getHorizonteLabel = (h: string | number) => {
    const val = String(h);
    if (val === "1" || val === "Intradia") return "Intradía";
    if (val === "2" || val === "CortoPlazo") return "Corto Plazo";
    if (val === "3" || val === "MedianoPlazo") return "Mediano Plazo";
    if (val === "4" || val === "LargoPlazo") return "Largo Plazo";
    return val;
};


export default function RecomendacionDetallePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [recomendacion, setRecomendacion] = useState<RecomendacionDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = user?.rol === RolUsuario.Admin; // Using Admin based on previous check of type file, but wait, type said Default logic?
    // Let's check imports. RolUsuario.Admin is correct based on type file I saw.

    // Handlers
    const handleApprove = async () => {
        if (!recomendacion) return;
        try {
            await aprobarRecomendacion(recomendacion.id);
            // Reload or update state
            window.location.reload();
        } catch (e) { console.error(e); }
    };

    const handleReject = async () => {
        if (!recomendacion) return;
        try {
            await rechazarRecomendacion(recomendacion.id);
            window.location.reload(); // Simple reload for now
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        const loadData = async () => {
            if (!id || authLoading) return;
            setLoading(true);

            try {
                const param = id as string;
                // Check if it's a UUID
                const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(param);

                let realId = param;

                if (!isUuid) {
                    // It's a slug, we need to find the ID
                    let allRecs;

                    if (isAdmin) {
                        allRecs = await getRecomendacionesActivasPendientes();
                    } else {
                        allRecs = await getRecomendaciones(true);
                    }

                    const match = allRecs.find(r => createSlug(r.titulo) === param);

                    if (match) {
                        realId = match.id;
                    } else {
                        throw new Error("Recomendación no encontrada por slug");
                    }
                }

                const data = await getRecomendacionById(realId);
                setRecomendacion(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la recomendación.");
                setLoading(false);
            }
        };

        loadData();
    }, [id, isAdmin, authLoading]);

    if (loading) return <Box display="flex" justifyContent="center" height="50vh" alignItems="center"><CircularProgress /></Box>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!recomendacion) return <Container sx={{ mt: 4 }}><Alert severity="info">Recomendación no encontrada.</Alert></Container>;

    const formattedDate = new Date(recomendacion.fechaInforme).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <RoleGuard>
            <Container maxWidth="lg" className={styles.mainContainer}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    className={styles.backButton}
                >
                    Volver
                </Button>

                <Paper variant="outlined" className={styles.headerPaper}>
                    {/* Header */}
                    <Box className={styles.headerContentBox}>
                        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Typography variant="overline" color="text.secondary" display="block" mb={1}>
                                    {recomendacion.fuente} • {formattedDate}
                                </Typography>
                                <Typography variant="h3" component="h1" gutterBottom className={styles.headerTitle}>
                                    {recomendacion.titulo}
                                </Typography>

                                <Stack direction="row" spacing={2} alignItems="center" className={styles.chipsStack}>
                                    <Chip
                                        icon={<PersonIcon />}
                                        label={recomendacion.persona ? `${recomendacion.persona.nombre} ${recomendacion.persona.apellido}` : "Experto"}
                                        variant="outlined"
                                    />
                                    <Chip
                                        icon={<AccessTimeIcon />}
                                        label={getHorizonteLabel(recomendacion.horizonte)}
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 'bold',
                                            ...getHorizonteStyle(recomendacion.horizonte)
                                        }}
                                    />
                                    <Chip
                                        icon={<ShieldIcon />}
                                        label={getRiesgoLabel(recomendacion.riesgo)}
                                        color={getRiesgoColor(recomendacion.riesgo) as any}
                                        variant="outlined"

                                    />
                                </Stack>
                            </Grid>
                            {/* Admin Actions for Pending */}
                            {isAdmin && recomendacion.estado === EstadoRecomendacion.Pendiente && (
                                <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<ThumbUpIcon />}
                                        onClick={handleApprove}
                                    >
                                        Aprobar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<ThumbDownIcon />}
                                        onClick={handleReject}
                                    >
                                        Rechazar
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Paper>

                <Divider className={styles.tesisDivider} />

                {/* Justification / Content */}
                <Box className={styles.tesisContainerBox}>
                    <Paper
                        variant="outlined"
                        className={styles.tesisPaper}
                    >
                        <Box className={styles.tesisTitleBox}>
                            <AutoGraphIcon className={styles.tesisIcon} />
                            <Typography variant="h6" fontWeight="bold">
                                Tesis de Inversión
                            </Typography>
                        </Box>

                        <Typography
                            variant="body1"
                            className={styles.tesisText}
                        >
                            {recomendacion.justificacionLogica}
                        </Typography>
                    </Paper>
                </Box>

                <Divider className={styles.tesisDivider} />

                {/* Recommended Assets */}
                <Box>
                    <Typography variant="h5" gutterBottom className={styles.assetsTitle}>Activos Recomendados</Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ticker</TableCell>
                                    <TableCell>Empresa</TableCell>
                                    <TableCell>Acción</TableCell>
                                    <TableCell align="right">Precio Entrada</TableCell>
                                    <TableCell align="right">Precio Objetivo</TableCell>
                                    <TableCell align="right">Stop Loss</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recomendacion.detalles.map((detalle, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>
                                            {/* Link to Asset Detail Page */}
                                            {detalle.activo ? (
                                                <MuiLink
                                                    component={Link}
                                                    href={`/activos/${detalle.activo.symbol}`}
                                                    className={styles.assetLink}
                                                >
                                                    {detalle.activo.symbol}
                                                </MuiLink>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">Unknown</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{detalle.activo?.nombre || '-'}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight="bold"
                                                sx={{ color: getAccionColor(detalle.accion) }}
                                            >
                                                {getAccionLabel(detalle.accion)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">${detalle.precioAlRecomendar?.toFixed(2)}</TableCell>
                                        <TableCell align="right">${detalle.precioObjetivo?.toFixed(2)}</TableCell>
                                        <TableCell align="right" className={styles.stopLossCell}>
                                            ${detalle.stopLoss?.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </RoleGuard>
    );
}
