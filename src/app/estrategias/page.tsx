"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Stack,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
    Divider,
    Avatar,
    Chip
} from "@mui/material";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { getCurrentUser } from "@/services/AuthService";
import { getPortafoliosDestacados } from "@/services/PortafolioService";
import { PortafolioDTO } from "@/types/Portafolio";

export default function StrategiesPage() {
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = getCurrentUser();
        const userFullName = user ? `${user.nombre} ${user.apellido}` : "";

        getPortafoliosDestacados()
            .then(data => {
                const filtered = data.filter(p => !p.nombreUsuario || p.nombreUsuario !== userFullName);
                setPortfolios(filtered);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <RoleGuard>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4, pb: 8 }}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Estrategias Destacadas <StarIcon color="warning" />
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Descubre y sigue las estrategias de inversión más exitosas de la comunidad.
                            </Typography>
                        </Box>
                    </Stack>

                    {loading ? (
                        <Box display="flex" justifyContent="center" py={10}>
                            <CircularProgress />
                        </Box>
                    ) : portfolios.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                            <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                            <Typography variant="h5" gutterBottom>
                                No hay estrategias destacadas
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Vuelve más tarde para ver las mejores oportunidades de inversión.
                            </Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {portfolios.map((p) => (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={p.id}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4
                                        },
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                                                <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: '70%' }}>
                                                    {p.nombre}
                                                </Typography>
                                                {p.esDestacado && (
                                                    <Chip label="Top" color="warning" size="small" icon={<StarIcon />} />
                                                )}
                                            </Stack>

                                            <Typography variant="body2" color="text.secondary" sx={{
                                                mb: 2,
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 3
                                            }}>
                                                {p.descripcion || "Sin descripción disponible."}
                                            </Typography>

                                            <Stack direction="row" alignItems="center" spacing={1} mt="auto">
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                    {p.nombreUsuario ? p.nombreUsuario[0].toUpperCase() : '?'}
                                                </Avatar>
                                                <Typography variant="caption" color="text.primary" fontWeight="medium">
                                                    {p.nombreUsuario || "Usuario Anónimo"}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                        <Divider />
                                        <CardActions sx={{ p: 2 }}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => router.push(`/portfolio?id=${p.id}`)}
                                            >
                                                Ver Detalle
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
        </RoleGuard>
    );
}
