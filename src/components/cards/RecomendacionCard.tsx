import React from 'react';
import {
    Card, CardContent, Typography, Box, Chip, Divider, Stack
} from '@mui/material';
import { RecomendacionDTO, Riesgo, AccionRecomendada, Horizonte } from '@/types/Recomendacion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';

interface Props {
    item: RecomendacionDTO;
}

const getRiesgoColor = (r: Riesgo) => {
    switch (r) {
        case Riesgo.Conservador: return "success";
        case Riesgo.Moderado: return "info";
        case Riesgo.Agresivo: return "warning";
        case Riesgo.Especulativo: return "error";
        default: return "default";
    }
};

const getRiesgoLabel = (r: Riesgo) => {
    return Riesgo[r];
};

const getAccionIcon = (a: AccionRecomendada) => {
    switch (a) {
        case AccionRecomendada.Comprar:
        case AccionRecomendada.CompraFuerte:
            return <TrendingUpIcon fontSize="small" />;
        case AccionRecomendada.Vender:
            return <TrendingDownIcon fontSize="small" />;
        default:
            return <RemoveIcon fontSize="small" />;
    }
};

const getAccionColor = (a: AccionRecomendada) => {
    if (a === AccionRecomendada.Comprar || a === AccionRecomendada.CompraFuerte) return "success.main";
    if (a === AccionRecomendada.Vender) return "error.main";
    return "text.secondary";
};

export default function RecomendacionCard({ item }: Props) {
    const formattedDate = new Date(item.fechaInforme).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box>
                        <Typography variant="overline" color="text.secondary">
                            {item.fuente} • {formattedDate}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                            {item.titulo}
                        </Typography>
                        <Typography variant="caption" color="primary">
                            Por {item.persona.nombre} {item.persona.apellido}
                        </Typography>
                    </Box>
                    <Chip
                        label={getRiesgoLabel(item.riesgo)}
                        color={getRiesgoColor(item.riesgo) as any}
                        size="small"
                        icon={<ShieldIcon />}
                        variant="outlined"
                    />
                </Box>

                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                        {item.justificacionLogica}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} mb={2}>
                    {item.sectoresObjetivo.map(s => (
                        <Chip key={s.id} label={s.nombre} size="small" sx={{ fontSize: '0.7rem' }} />
                    ))}
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`Horizonte: ${Horizonte[item.horizonte]}`}
                        size="small"
                        variant="filled"
                        sx={{ fontSize: '0.7rem' }}
                    />
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Box>
                    {item.detalles.slice(0, 3).map((det, idx) => (
                        <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" my={0.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {det.activo?.symbol}
                                </Typography>
                                <Typography variant="caption" sx={{ color: getAccionColor(det.accion), display: 'flex', alignItems: 'center' }}>
                                    {getAccionIcon(det.accion)} {AccionRecomendada[det.accion]}
                                </Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Target: ${det.precioObjetivo}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    {item.detalles.length > 3 && (
                        <Typography variant="caption" align="center" display="block" color="text.secondary" mt={1}>
                            +{item.detalles.length - 3} activos más...
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
