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
    Chip,
    IconButton
} from "@mui/material";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import { getPortafoliosDestacados } from "@/services/PortafolioService";
import { PortafolioDTO } from "@/types/Portafolio";
import { useAuth } from "@/hooks/useAuth";
import FloatingMessage from "@/components/ui/FloatingMessage";

export default function StrategiesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Removed specific favorites state
    const isLoggedIn = !!user;

    useEffect(() => {
        // useAuth handles auth state
    }, []);

    const fetchPortfolios = () => {
        setLoading(true);
        getPortafoliosDestacados()
            .then(data => {
                console.log("Portfolios Data:", data); // Debug
                setPortfolios(data);
            })
            .catch(err => {
                console.error(err);
                setError("Error al cargar las estrategias destacadas.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const topPortfolios = portfolios.filter(p => p.esTop).slice(0, 3);
    const otherPortfolios = portfolios.filter(p => !p.esTop);

    return (
        <RoleGuard>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4, pb: 8 }}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Stack direction="column" spacing={3} mb={4}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Estrategias Destacadas <TrendingUpIcon color="primary" />
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Descubre las estrategias de inversión más exitosas de la comunidad.
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    {loading ? (
                        <Box display="flex" justifyContent="center" py={10}>
                            <CircularProgress />
                        </Box>
                    ) : portfolios.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                            <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                            <Typography variant="h5" gutterBottom>
                                No hay estrategias disponibles
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Vuelve más tarde para ver nuevas oportunidades.
                            </Typography>
                        </Paper>
                    ) : (loading || portfolios.length === 0) && error ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                            <Typography variant="h5" color="error" gutterBottom>
                                Error al cargar
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {error}
                            </Typography>
                            <Button sx={{ mt: 2 }} variant="outlined" onClick={fetchPortfolios}>Reintentar</Button>
                        </Paper>
                    ) : (
                        <>
                            {/* TOP 3 Highlight Section */}
                            {topPortfolios.length > 0 && (
                                <Box mb={6}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FFD700' }}>
                                        <StarIcon sx={{ color: '#FFD700' }} /> ESTRATEGIAS POPULARES
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {topPortfolios.map((p) => {
                                            const isMyPortfolio = (user?.id === p.personaId) ||
                                                (user && p.nombreUsuario === `${user.nombre} ${user.apellido}`);
                                            return (
                                                <Grid size={{ xs: 12, md: 4 }} key={p.id}>
                                                    <Card sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': { transform: 'scale(1.02)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
                                                        borderRadius: 3,
                                                        border: '2px solid #FFD700',
                                                        position: 'relative',
                                                        overflow: 'visible'
                                                    }}>
                                                        {/* Removed Favorite Button */}
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: -12,
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            bgcolor: '#FFD700',
                                                            color: 'black',
                                                            px: 2,
                                                            py: 0.5,
                                                            borderRadius: 20,
                                                            fontWeight: 'bold',
                                                            fontSize: '0.75rem',
                                                            boxShadow: 2,
                                                            zIndex: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5
                                                        }}>
                                                            <StarIcon fontSize="inherit" /> TOP SELECTION
                                                        </Box>
                                                        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                                                            <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                                                                {p.nombre}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" align="center" paragraph>
                                                                {p.descripcion || "Estrategia de alto rendimiento."}
                                                            </Typography>

                                                            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={2}>
                                                                <Avatar src={p.fotoPerfil} sx={{ width: 40, height: 40, border: '2px solid #FFD700' }}>
                                                                    {p.nombreUsuario ? p.nombreUsuario[0].toUpperCase() : '?'}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="subtitle2" component="div">
                                                                        {isMyPortfolio ? "Tú" : p.nombreUsuario}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {p.rolUsuario}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </CardContent>
                                                        <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                                                            <Button
                                                                variant="contained"
                                                                sx={{ bgcolor: '#FFD700', color: 'black', '&:hover': { bgcolor: '#FFC107' } }}
                                                                onClick={() => router.push(`/portfolio?id=${p.id}`)}
                                                            >
                                                                Ver Estrategia
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            )}

                            {/* Standard Destacados */}
                            {otherPortfolios.length > 0 && (
                                <>
                                    {topPortfolios.length > 0 && <Divider sx={{ mb: 4 }} >Otras Estrategias Destacadas</Divider>}
                                    <Grid container spacing={3}>
                                        {otherPortfolios.map((p) => {
                                            const isMyPortfolio = (user?.id === p.personaId) ||
                                                (user && p.nombreUsuario === `${user.nombre} ${user.apellido}`);
                                            return (
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
                                                        borderColor: 'divider',
                                                        position: 'relative'
                                                    }}>
                                                        {/* Removed Favorite Button */}
                                                        <CardContent sx={{ flexGrow: 1 }}>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                                                                <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: '80%' }}>
                                                                    {p.nombre}
                                                                </Typography>

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
                                                                <Avatar src={p.fotoPerfil} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                                    {p.nombreUsuario ? p.nombreUsuario[0].toUpperCase() : '?'}
                                                                </Avatar>
                                                                <Typography variant="caption" color="text.primary" fontWeight="medium">
                                                                    {isMyPortfolio ? "Tú" : (p.nombreUsuario || "Usuario Anónimo")}
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
                                            );
                                        })}
                                    </Grid>
                                </>
                            )}
                        </>
                    )}
                </Container>
                <FloatingMessage
                    open={!!error && portfolios.length > 0}
                    message={error || ""}
                    severity="error"
                    onClose={() => setError(null)}
                />
            </Box>
        </RoleGuard >
    );
}
