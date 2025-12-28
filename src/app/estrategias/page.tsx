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
    ToggleButton,
    ToggleButtonGroup,
    Snackbar,
    Alert,
    IconButton
} from "@mui/material";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SearchIcon from '@mui/icons-material/Search';
import { getCurrentUser } from "@/services/AuthService";
import { getPortafoliosDestacados, toggleSeguirPortafolio } from "@/services/PortafolioService";
import { PortafolioDTO } from "@/types/Portafolio";

export default function StrategiesPage() {
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!sessionStorage.getItem("fa_token"));
    }, []);

    const fetchPortfolios = () => {
        setLoading(true);
        getPortafoliosDestacados()
            .then(data => {
                setPortfolios(data);
                // If backend doesn't return loSigo yet, we might want to fetch user's defaults or assume false.
                // For now we rely on DTO.
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const handleToggleFollow = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            setOpenSnack(true);
            return;
        }

        // Optimistic update
        const portfolio = portfolios.find(p => p.id === id);
        if (!portfolio) return;

        const newValue = !portfolio.loSigo;

        setPortfolios(prev => prev.map(p =>
            p.id === id ? { ...p, loSigo: newValue } : p
        ));

        try {
            await toggleSeguirPortafolio(id);
        } catch (error) {
            console.error("Error toggling follow:", error);
            // Revert
            setPortfolios(prev => prev.map(p =>
                p.id === id ? { ...p, loSigo: !newValue } : p
            ));
        }
    };

    // Filter logic
    const displayedPortfolios = onlyFavorites
        ? portfolios.filter(p => p.loSigo)
        : portfolios;

    const topPortfolios = displayedPortfolios.filter(p => p.esTop).slice(0, 3);
    const otherPortfolios = displayedPortfolios.filter(p => !p.esTop);

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
                                    Descubre y sigue las estrategias de inversión más exitosas de la comunidad.
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Favorites Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ToggleButtonGroup
                                value={onlyFavorites}
                                exclusive
                                onChange={(e, newVal) => {
                                    if (newVal !== null) {
                                        if (newVal === true && !isLoggedIn) {
                                            setOpenSnack(true);
                                            return;
                                        }
                                        setOnlyFavorites(newVal);
                                    }
                                }}
                                sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <ToggleButton value={false} sx={{ px: 3, py: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <SearchIcon fontSize="small" />
                                        <Typography variant="button" sx={{ textTransform: 'none', fontWeight: 700 }}>Explorar</Typography>
                                    </Stack>
                                </ToggleButton>
                                <ToggleButton value={true} sx={{ px: 3, py: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {onlyFavorites ? <StarIcon fontSize="small" color="warning" /> : <StarBorderIcon fontSize="small" />}
                                        <Typography variant="button" sx={{ textTransform: 'none', fontWeight: 700 }}>Mis Favoritos</Typography>
                                    </Stack>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Stack>

                    {loading ? (
                        <Box display="flex" justifyContent="center" py={10}>
                            <CircularProgress />
                        </Box>
                    ) : displayedPortfolios.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                            <StarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                            <Typography variant="h5" gutterBottom>
                                {onlyFavorites ? "No tienes estrategias favoritas" : "No hay estrategias disponibles"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {onlyFavorites ? "Explora el mercado y marca tus favoritas para verlas aquí." : "Vuelve más tarde para ver nuevas oportunidades."}
                            </Typography>
                            {onlyFavorites && (
                                <Button variant="outlined" onClick={() => setOnlyFavorites(false)}>
                                    Ver Todas
                                </Button>
                            )}
                        </Paper>
                    ) : (
                        <>
                            {/* TOP 3 Highlight Section */}
                            {topPortfolios.length > 0 && (
                                <Box mb={6}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FFD700' }}>
                                        <StarIcon sx={{ color: '#FFD700' }} /> TOP 3 ESTRATEGIAS
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {topPortfolios.map((p) => (
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
                                                    {isLoggedIn && (
                                                        <IconButton
                                                            onClick={(e) => handleToggleFollow(e, p.id)}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                bgcolor: 'rgba(0,0,0,0.5)',
                                                                color: p.loSigo ? '#FFD700' : 'white',
                                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                                                zIndex: 3
                                                            }}
                                                        >
                                                            {p.loSigo ? <StarIcon /> : <StarBorderIcon />}
                                                        </IconButton>
                                                    )}
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
                                                                    {p.nombreUsuario}
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
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Standard Destacados */}
                            {otherPortfolios.length > 0 && (
                                <>
                                    {topPortfolios.length > 0 && <Divider sx={{ mb: 4 }} >Otras Estrategias Destacadas</Divider>}
                                    <Grid container spacing={3}>
                                        {otherPortfolios.map((p) => (
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
                                                    {isLoggedIn && (
                                                        <IconButton
                                                            onClick={(e) => handleToggleFollow(e, p.id)}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                zIndex: 2,
                                                                color: p.loSigo ? 'warning.main' : 'action.disabled',
                                                            }}
                                                        >
                                                            {p.loSigo ? <StarIcon /> : <StarBorderIcon />}
                                                        </IconButton>
                                                    )}
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                                                            <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: '80%' }}>
                                                                {p.nombre}
                                                            </Typography>
                                                            {p.esDestacado && (
                                                                <Chip label="Destacado" color="info" size="small" variant="outlined" />
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
                                                            <Avatar src={p.fotoPerfil} sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
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
                                </>
                            )}
                        </>
                    )}
                </Container>

                <Snackbar
                    open={openSnack}
                    autoHideDuration={4000}
                    onClose={() => setOpenSnack(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="info" onClose={() => setOpenSnack(false)}>
                        Inicia sesión para guardar tus estrategias favoritas.
                    </Alert>
                </Snackbar>
            </Box>
        </RoleGuard>
    );
}
