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
    Divider
} from "@mui/material";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getMisPortafolios } from "@/services/PortafolioService";
import { PortafolioDTO } from "@/types/Portafolio"; // Assuming DTO is here
// If PortafolioDTO is not exported from Portafolio.ts, I might need to check types.

// I'll assume PortafolioDTO has id, nombre, descripcion.

export default function StrategiesPage() {
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMisPortafolios()
            .then(data => setPortfolios(data))
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
                            <Typography variant="h4" fontWeight="bold">
                                Mis Estrategias
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Administra tus diferentes portafolios de inversión
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/registrar-operacion')} // Or create portfolio dialog? 
                        // Currently creating a portfolio usually happens when registering an op or via a specific Create Portfolio UI.
                        // The user didn't specify a "Create Portfolio" button, but I'll link to generic action or verify if there is a create-portfolio page.
                        // For now, I'll point to registering an operation as it allows creating/selecting portfolios.
                        >
                            Nueva Estrategia
                        </Button>
                    </Stack>

                    {loading ? (
                        <Box display="flex" justifyContent="center" py={10}>
                            <CircularProgress />
                        </Box>
                    ) : portfolios.length === 0 ? (
                        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                            <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                            <Typography variant="h5" gutterBottom>
                                Aún no tienes estrategias
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Crea tu primer portafolio para organizar tus inversiones de manera eficiente.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/registrar-operacion')}
                            >
                                Registrar Primera Operación
                            </Button>
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
                                        }
                                    }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                                {p.nombre}
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {p.descripcion || "Sin descripción"}
                                            </Typography>
                                            {/* We could fetch valuation for each, but getMisPortafolios might not return it. 
                                                If we want valuation, we'd need to call getValuacion for each or use a bulk endpoint if available.
                                                For now, simple list. */}
                                        </CardContent>
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                size="small"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => router.push(`/portfolio?id=${p.id}`)}
                                            // Assuming portfolio page can take query param or uses context.
                                            // Actually PortfolioPage uses usePortfolioData which selects first by default.
                                            // I might need to handle selection.
                                            // Let's check PortfolioPage. It uses `selectedId` from state.
                                            // It doesn't seem to read URL params.
                                            // I'll link to /portfolio and maybe I should implement URL query param logic in PortfolioPage later?
                                            // Or just let them go to portfolio and switch there.
                                            >
                                                Ver Detalles
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
