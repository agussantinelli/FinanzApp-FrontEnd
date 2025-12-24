import React from 'react';
import Link from 'next/link';
import { createSlug } from "@/utils/slug";
import {
    Card, CardContent, Typography, Box, Chip, Divider, Stack
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';
import { colors } from '@/app-theme/design-tokens';
import { RecomendacionResumenDTO, Riesgo, AccionRecomendada, Horizonte, EstadoRecomendacion } from '@/types/Recomendacion';
import CircleIcon from '@mui/icons-material/Circle';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
    item: RecomendacionResumenDTO;
    showStatus?: boolean;
}

const getRiesgoColor = (r: string) => {
    switch (r) {
        case "Conservador": return "success";
        case "Moderado": return "info";
        case "Agresivo": return "warning";
        case "Especulativo": return "error";
        default: return "default";
    }
};

const getHorizonteLabel = (h: string) => {
    if (!h) return "Desconocido";
    switch (h) {
        case "Intradia": return "Intradía";
        case "CortoPlazo": return "Corto Plazo";
        case "MedianoPlazo": return "Mediano Plazo";
        case "LargoPlazo": return "Largo Plazo";
        default: return h.replace(/([A-Z])/g, ' $1').trim(); // Fallback: "CamelCase" -> "Camel Case"
    }
};

const getHorizonteStyle = (h: string) => {
    switch (h) {
        case "Intradia":
            return { color: colors.neon.magenta, borderColor: colors.neon.magenta, boxShadow: `0 0 5px ${colors.neon.magenta}40` };
        case "CortoPlazo":
            return { color: colors.neon.cyan, borderColor: colors.neon.cyan, boxShadow: `0 0 5px ${colors.neon.cyan}40` };
        case "MedianoPlazo":
            return { color: colors.neon.orange, borderColor: colors.neon.orange, boxShadow: `0 0 5px ${colors.neon.orange}40` };
        case "LargoPlazo":
            return { color: colors.neon.green, borderColor: colors.neon.green, boxShadow: `0 0 5px ${colors.neon.green}40` };
        default:
            return { color: colors.textPrimary, borderColor: colors.textPrimary };
    }
};

const getEstadoConfig = (e: number) => {
    switch (e) {
        case EstadoRecomendacion.Pendiente:
            return { label: "Pendiente", color: "warning", icon: <AccessTimeIcon fontSize="small" /> };
        case EstadoRecomendacion.Aceptada:
            return { label: "Aceptada", color: "success", icon: <ShieldIcon fontSize="small" /> };
        case EstadoRecomendacion.Rechazada:
            return { label: "Rechazada", color: "error", icon: <RemoveIcon fontSize="small" /> };
        case EstadoRecomendacion.Eliminada:
            return { label: "Eliminada", color: "default", icon: <CircleIcon fontSize="small" /> };
        case EstadoRecomendacion.Cerrada:
            return { label: "Cerrada", color: "default", icon: <AccessTimeIcon fontSize="small" /> };
        default:
            return { label: "Desconocido", color: "default", icon: <CircleIcon fontSize="small" /> };
    }
};

export default function RecomendacionCard({ item, showStatus = false }: Props) {
    const formattedDate = new Date(item.fecha).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    // Default to Aprobada if not present (backward comp), or check value
    const estadoConfig = item.estado !== undefined ? getEstadoConfig(item.estado) : null;



    // Acertada Logic
    let resolutionConfig = null;
    if (item.estado === EstadoRecomendacion.Cerrada && item.esAcertada !== null && item.esAcertada !== undefined) {
        if (item.esAcertada) {
            resolutionConfig = { label: "Acertada", color: "success", icon: <CheckCircleIcon /> };
        } else {
            resolutionConfig = { label: "Fallida", color: "error", icon: <CancelIcon /> };
        }
    }

    return (
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', borderColor: 'primary.main', cursor: 'pointer' },
                borderColor: item.esDestacada ? colors.neon.gold : undefined,
                boxShadow: item.esDestacada ? `0 0 10px ${colors.neon.gold}40` : undefined
            }}
        >
            {item.esDestacada && (
                <Box sx={{ position: 'absolute', top: 0, right: 0, p: 0.5, backgroundColor: colors.neon.gold, borderBottomLeftRadius: 8, color: 'black', zIndex: 5 }}>
                    <StarIcon fontSize="small" />
                </Box>
            )}
            <Link href={`/recomendaciones/${createSlug(item.titulo)}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Box>
                                <Typography variant="overline" color="text.secondary">
                                    {item.fuente} • {formattedDate}
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                    {item.titulo}
                                </Typography>
                                <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <PersonIcon fontSize="inherit" /> {item.autorNombre}
                                </Typography>
                            </Box>

                            <Box display="flex" gap={1} flexWrap="wrap">
                                {resolutionConfig && (
                                    <Chip
                                        label={resolutionConfig.label}
                                        color={resolutionConfig.color as any}
                                        size="small"
                                        icon={resolutionConfig.icon}
                                        variant="filled"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                                {showStatus && estadoConfig && !resolutionConfig && (
                                    <Chip
                                        label={estadoConfig.label}
                                        color={estadoConfig.color as any}
                                        size="small"
                                        variant="filled" // Filled to distinguish from Risk
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                )}
                                <Chip
                                    label={item.riesgo}
                                    color={getRiesgoColor(item.riesgo) as any}
                                    size="small"
                                    icon={<ShieldIcon />}
                                    variant="outlined"
                                />
                            </Box>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="body2" color="text.secondary">
                                {item.cantidadActivos} activo{item.cantidadActivos !== 1 ? 's' : ''} recomendados.
                                <br />
                                Ver detalle completo para más información.
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip
                                icon={<AccessTimeIcon style={{ color: 'inherit' }} />}
                                label={getHorizonteLabel(item.horizonte)}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    ...getHorizonteStyle(item.horizonte),
                                    backgroundColor: 'rgba(0,0,0,0.2)'
                                }}
                            />
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Box mt={1}>
                            <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                Haz clic para ver la estrategia completa.
                            </Typography>
                        </Box>
                    </CardContent>
                </Box>
            </Link>
        </Card>
    );
}
