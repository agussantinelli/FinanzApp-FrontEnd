import React from 'react';
import {
    Card, CardContent, Typography, Box, Chip, Divider, Stack
} from '@mui/material';
import { RecomendacionResumenDTO, Riesgo, AccionRecomendada, Horizonte } from '@/types/Recomendacion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';

interface Props {
    item: RecomendacionResumenDTO;
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

const getHorizonteLabel = (h: string) => h;

export default function RecomendacionCard({ item }: Props) {
    const formattedDate = new Date(item.fecha).toLocaleDateString('es-AR', {
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
                        <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon fontSize="inherit" /> {item.autorNombre}
                        </Typography>
                    </Box>
                    <Chip
                        label={item.riesgo}
                        color={getRiesgoColor(item.riesgo) as any}
                        size="small"
                        icon={<ShieldIcon />}
                        variant="outlined"
                    />
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
                        icon={<AccessTimeIcon />}
                        label={`Horizonte: ${item.horizonte}`}
                        size="small"
                        variant="filled"
                        sx={{ fontSize: '0.7rem' }}
                    />
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Box mt={1}>
                    <Typography variant="caption" color="text.secondary" fontStyle="italic">
                        Haz clic para ver la estrategia completa.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
