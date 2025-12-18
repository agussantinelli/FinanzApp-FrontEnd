"use client";

import { useEffect } from 'react';
import { Typography, Grid, Box, CircularProgress, Alert } from "@mui/material";
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import RecomendacionCard from '@/components/cards/RecomendacionCard';
import styles from "./styles/Recomendaciones.module.css";

export default function RecomendacionesPage() {
    const { data, loading, error, fetchAll } = useRecomendaciones();

    useEffect(() => {
        fetchAll(true); // Fetch active recommendations
    }, [fetchAll]);

    return (
        <main className={styles.container}>
            <Box mb={4}>
                <Typography variant="h4" className={styles.title} gutterBottom>
                    Recomendaciones de Expertos
                </Typography>
                <Typography color="text.secondary">
                    Descubre estrategias de inversión diseñadas por profesionales.
                </Typography>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" my={5}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && data.length === 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No hay recomendaciones activas en este momento.
                </Alert>
            )}

            <Grid container spacing={3}>
                {data.map((item) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                        <RecomendacionCard item={item} />
                    </Grid>
                ))}
            </Grid>
        </main>
    );
}
