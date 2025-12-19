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

const getHorizonteLabel = (h: string) => {
    // Add space before capital letters if missing (e.g. LargoPlazo -> Largo Plazo)
    // Also fix specific known cases if needed
    if (!h) return "Desconocido";
    switch (h) {
        case "Intradia": return "Intradía";
        case "CortoPlazo": return "Corto Plazo";
        case "MedianoPlazo": return "Mediano Plazo";
        case "LargoPlazo": return "Largo Plazo";
        default: return h.replace(/([A-Z])/g, ' $1').trim(); // Fallback: "CamelCase" -> "Camel Case"
    }
};

const getHorizonteColor = (h: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (h) {
        case "Intradia": return "secondary"; // Purple/Pink for very short term
        case "CortoPlazo": return "info"; // Blue
        case "MedianoPlazo": return "warning"; // Orange
        case "LargoPlazo": return "success"; // Green
        default: return "default";
    }
};

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
                        label={getHorizonteLabel(item.horizonte)}
                        color={getHorizonteColor(item.horizonte)}
                        size="small"
                        variant="outlined"  // Changed to outlined or could be filled based on preference. User asked for "better visually". 
                        // Filled with color usually pops more. Let's try filled for logic but maybe user wants cleaner?
                        // Activo tags are usually outlined. Risk is outlined. Let's use outlined for consistency or filled? 
                        // Risk is Outlined in my code above. Let's use variant="outlined" to match Risk style.
                        // Actually user image shows Risk is Outlined with color font/border.
                        // Let's use variant="outlined" to match Risk.
                        sx={{ fontSize: '0.75rem', fontWeight: 500 }}
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
