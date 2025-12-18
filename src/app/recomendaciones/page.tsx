"use client";

import { Typography, Grid, Box, CircularProgress, Alert, TextField, Button, FormControlLabel, Checkbox, Paper } from "@mui/material";
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import RecomendacionCard from '@/components/cards/RecomendacionCard';
import styles from "./styles/Recomendaciones.module.css";
import React, { useState } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export default function RecomendacionesPage() {
    const { data, loading, error, filters, applyFilters, clearFilters } = useRecomendaciones();

    // Local state for inputs to avoid triggering fetch on every keystroke
    const [localFilters, setLocalFilters] = useState({
        sectorId: filters.sectorId || "",
        autorId: filters.autorId || "",
        activoId: filters.activoId || ""
    });

    const handleApply = () => {
        applyFilters({
            sectorId: localFilters.sectorId || undefined,
            autorId: localFilters.autorId || undefined,
            activoId: localFilters.activoId || undefined
        });
    };

    const handleClear = () => {
        clearFilters();
        setLocalFilters({ sectorId: "", autorId: "", activoId: "" });
    };

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

            <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    <TextField
                        label="ID Sector"
                        size="small"
                        value={localFilters.sectorId}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, sectorId: e.target.value }))}
                    />
                    <TextField
                        label="ID Autor"
                        size="small"
                        value={localFilters.autorId}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, autorId: e.target.value }))}
                    />
                    <TextField
                        label="ID Activo"
                        size="small"
                        value={localFilters.activoId}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, activoId: e.target.value }))}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.soloActivas}
                                onChange={(e) => applyFilters({ soloActivas: e.target.checked })}
                            />
                        }
                        label="Solo Activas"
                    />
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        onClick={handleApply}
                    >
                        Filtrar
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CleaningServicesIcon />}
                        onClick={handleClear}
                    >
                        Limpiar
                    </Button>
                </Box>
            </Paper>

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
                    No hay recomendaciones encontradas con estos filtros.
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
