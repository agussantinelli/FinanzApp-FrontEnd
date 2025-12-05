"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Stack,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ActivoDTO } from "@/types/Activo";
import { getActivos } from "@/services/ActivosService";

export default function ActivoDetalle() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [activo, setActivo] = useState<ActivoDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Note: Ideally we would have a getActivoById endpoint. 
        // For now, we fetch all (or filter by type if known) and find the one.
        // Optimization: If the previous page state could be passed, that would be better.
        // Or if the backend supports /api/activos/{id}.
        // Assuming for now we re-fetch or the user might land here directly.
        const loadActivo = async () => {
            try {
                // Fetching all for now as we don't have a specific ID endpoint in the prompt description
                // If the list is huge, this is inefficient, but fits the current constraints.
                const allActivos = await getActivos("Todos");
                const found = allActivos.find((a) => a.id === id);
                setActivo(found || null);
            } catch (error) {
                console.error("Error loading asset details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadActivo();
        }
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!activo) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h5" align="center">Activo no encontrado</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button variant="outlined" onClick={() => router.back()}>Volver</Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 2 }}
            >
                Volver al Mercado
            </Button>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
                    <Box>
                        <Typography variant="h3" component="h1" fontWeight="bold">
                            {activo.symbol}
                        </Typography>
                        <Typography variant="h5" color="text.secondary">
                            {activo.nombre}
                        </Typography>
                    </Box>
                    <Stack direction="column" alignItems="flex-end" spacing={1}>
                        <Chip label={activo.tipo} color="primary" variant="filled" />
                        <Chip label={activo.moneda} variant="outlined" />
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            Descripción
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            {activo.descripcion}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Detalles Adicionales
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Box>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Mercado
                                        </Typography>
                                        <Typography variant="body2">
                                            {activo.esLocal ? "Local (Argentina)" : "Internacional"}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            ID de Sistema
                                        </Typography>
                                        <Typography variant="body2">
                                            #{activo.id}
                                        </Typography>
                                    </Box>
                                    {/* Add more fields here if available in DTO */}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
