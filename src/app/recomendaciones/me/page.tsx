"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Typography, Grid, Box, CircularProgress, Alert, Button,
    Paper, Select, InputLabel, FormControl, MenuItem
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

import { useAuth } from "@/hooks/useAuth";
import { RolUsuario } from "@/types/Usuario";
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import RecomendacionCard from '@/components/cards/RecomendacionCard';
import PageHeader from '@/components/ui/PageHeader';
import { RoleGuard } from "@/components/auth/RoleGuard";
import { getSectores } from "@/services/SectorService";
import { SectorDTO } from "@/types/Sector";

// Reuse main styles or create new? Reuse main styles for consistency
import styles from "../styles/Recomendaciones.module.css";

export default function MisRecomendacionesPage() {
    const { data, loading, error, applyFilters, clearFilters } = useRecomendaciones();
    const { user } = useAuth();
    const router = useRouter();

    const [sectores, setSectores] = useState<SectorDTO[]>([]);
    const [selectedSector, setSelectedSector] = useState("");
    const [selectedHorizonte, setSelectedHorizonte] = useState("");
    const [selectedRiesgo, setSelectedRiesgo] = useState("");

    // Initial load: Set filter for ME and ALL statuses
    useEffect(() => {
        if (user?.id) {
            applyFilters({ autorId: user.id, soloActivas: false });
        }
        getSectores().then(setSectores).catch(console.error);
    }, [user?.id]); // Run when user ID is available

    const handleApply = () => {
        if (!user?.id) return;
        applyFilters({
            autorId: user.id, // Always enforce ME
            soloActivas: false, // Always include pending/rejected
            sectorId: selectedSector || undefined,
            horizonteId: selectedHorizonte ? Number(selectedHorizonte) : undefined,
            riesgoId: selectedRiesgo ? Number(selectedRiesgo) : undefined,
        });
    };

    const handleClear = () => {
        setSelectedSector("");
        setSelectedHorizonte("");
        setSelectedRiesgo("");
        if (user?.id) {
            // Reset to just ME + inactive
            applyFilters({ autorId: user.id, soloActivas: false, sectorId: undefined, horizonteId: undefined, riesgoId: undefined, activoId: undefined });
        }
    };

    return (
        <RoleGuard allowedRoles={[RolUsuario.Experto]}>
            <main className={styles.container}>
                <PageHeader
                    title="Mis Recomendaciones"
                    subtitle="Gestión"
                    description="Revisa el estado de tus recomendaciones y su rendimiento."
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.push('/recomendaciones')}
                    >
                        Volver al Panel
                    </Button>
                </PageHeader>

                <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Sector Filter */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Sector</InputLabel>
                                <Select
                                    value={selectedSector}
                                    label="Sector"
                                    onChange={(e) => setSelectedSector(e.target.value)}
                                >
                                    <MenuItem value=""><em>Todos</em></MenuItem>
                                    {sectores.map(s => (
                                        <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Risk Filter */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Riesgo</InputLabel>
                                <Select
                                    value={selectedRiesgo}
                                    label="Riesgo"
                                    onChange={(e) => setSelectedRiesgo(e.target.value)}
                                >
                                    <MenuItem value=""><em>Todos</em></MenuItem>
                                    <MenuItem value={1}>Conservador</MenuItem>
                                    <MenuItem value={2}>Moderado</MenuItem>
                                    <MenuItem value={3}>Agresivo</MenuItem>
                                    <MenuItem value={4}>Especulativo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Horizon Filter */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Horizonte</InputLabel>
                                <Select
                                    value={selectedHorizonte}
                                    label="Horizonte"
                                    onChange={(e) => setSelectedHorizonte(e.target.value)}
                                >
                                    <MenuItem value=""><em>Todos</em></MenuItem>
                                    <MenuItem value={1}>Intradía (Hoy)</MenuItem>
                                    <MenuItem value={2}>Corto (&lt; 6 meses)</MenuItem>
                                    <MenuItem value={3}>Mediano (6 - 18 meses)</MenuItem>
                                    <MenuItem value={4}>Largo (&gt; 18 meses)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 2 }} display="flex" gap={1}>
                            <Button
                                variant="outlined"
                                onClick={handleClear}
                                sx={{ minWidth: 'auto', px: 2 }}
                            >
                                <CleaningServicesIcon />
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<FilterListIcon />}
                                onClick={handleApply}
                                fullWidth
                            >
                                Filtrar
                            </Button>
                        </Grid>
                    </Grid>
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
                        No tienes recomendaciones registradas aún.
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {data.map((item) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                            <RecomendacionCard item={item} showStatus={true} />
                        </Grid>
                    ))}
                </Grid>
            </main>
        </RoleGuard>
    );
}
