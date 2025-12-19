"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box, Typography, Paper, Grid, Chip, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, CircularProgress, Alert, Container, Stack, Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { RecomendacionDTO, RecomendacionDetalleDTO, AccionRecomendada } from '@/types/Recomendacion';
import { getRecomendacionById } from '@/services/RecomendacionesService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import { colors } from '@/app-theme/design-tokens';

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
    // Handle both string (from Resumen) and Enum number (from DTO) if needed
    // DTO says Riesgo enum (1,2,3,4)
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
    const [recomendacion, setRecomendacion] = useState<RecomendacionDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getRecomendacionById(id as string)
                .then(data => {
                    setRecomendacion(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError("No se pudo cargar la recomendación.");
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <Box display="flex" justifyContent="center" height="50vh" alignItems="center"><CircularProgress /></Box>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!recomendacion) return <Container sx={{ mt: 4 }}><Alert severity="info">Recomendación no encontrada.</Alert></Container>;

    const formattedDate = new Date(recomendacion.fechaInforme).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 3 }}
            >
                Volver
            </Button>

            <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                {/* Header */}
                <Box mb={3}>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="overline" color="text.secondary" display="block" mb={1}>
                                {recomendacion.fuente} • {formattedDate}
                            </Typography>
                            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                                {recomendacion.titulo}
                            </Typography>

                            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
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
                    </Grid>
                </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />

            {/* Justification / Content */}
            <Box mb={4}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        background: `linear-gradient(135deg, ${colors.cardBgTranslucent} 0%, rgba(0,0,0,0) 100%)`,
                        borderLeft: `4px solid ${colors.primary}`,
                        borderRadius: 2
                    }}
                >
                    <Box display="flex" alignItems="center" mb={2}>
                        <AutoGraphIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                            Tesis de Inversión
                        </Typography>
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-line',
                            lineHeight: 1.8,
                            color: 'text.primary',
                            fontSize: '1.05rem'
                        }}
                    >
                        {recomendacion.justificacionLogica}
                    </Typography>
                </Paper>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Recommended Assets */}
            <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Activos Recomendados</Typography>
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
                                                underline="hover"
                                                fontWeight="bold"
                                                color="primary"
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
                                    <TableCell align="right" sx={{ color: 'error.main' }}>
                                        ${detalle.stopLoss?.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}
