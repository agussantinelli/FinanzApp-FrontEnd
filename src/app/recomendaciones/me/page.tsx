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
import { Riesgo, Horizonte } from "@/types/Recomendacion";

import styles from "../styles/Recomendaciones.module.css";

const getRiesgoString = (val: number | string) => {
    switch (Number(val)) {
        case 1: return "Conservador";
        case 2: return "Moderado";
        case 3: return "Agresivo";
        case 4: return "Especulativo";
        default: return "";
    }
};

const getHorizonteString = (val: number | string) => {
    switch (Number(val)) {
        case 1: return "Intradia";
        case 2: return "CortoPlazo";
        case 3: return "MedianoPlazo";
        case 4: return "LargoPlazo";
        default: return "";
    }
};

export default function MisRecomendacionesPage() {
    const { data, loading, error, applyFilters, clearFilters } = useRecomendaciones();
    const { user } = useAuth();
    const router = useRouter();

    const [sectores, setSectores] = useState<SectorDTO[]>([]);

    const [selectedSector, setSelectedSector] = useState("");
    const [selectedHorizonte, setSelectedHorizonte] = useState("");
    const [selectedRiesgo, setSelectedRiesgo] = useState("");

    const [activeRiesgo, setActiveRiesgo] = useState("");
    const [activeHorizonte, setActiveHorizonte] = useState("");
    const [activeSector, setActiveSector] = useState("");

    useEffect(() => {
        if (user?.id) {
            applyFilters({ autorId: user.id, soloActivas: false });
        }
        getSectores().then(setSectores).catch(console.error);
    }, [user?.id]); // Run when user ID is available

    const handleApply = () => {
        if (!user?.id) return;

        // Update Hook Filters (Force Author Fetch always)
        applyFilters({
            autorId: user.id,
            soloActivas: false,
            sectorId: undefined, // Force undefined so hook uses autorId
            horizonteId: undefined,
            riesgoId: undefined
        });

        // Update Client-Side Filters
        setActiveRiesgo(selectedRiesgo);
        setActiveHorizonte(selectedHorizonte);
        setActiveSector(selectedSector);
    };

    const handleClear = () => {
        setSelectedSector("");
        setSelectedHorizonte("");
        setSelectedRiesgo("");
        setActiveRiesgo("");
        setActiveHorizonte("");
        setActiveSector("");

        if (user?.id) {
            // Reset to just ME + inactive
            applyFilters({
                autorId: user.id,
                soloActivas: false,
                sectorId: undefined,
                horizonteId: undefined,
                riesgoId: undefined,
                activoId: undefined
            });
        }
    };

    // Filter Logic
    const displayedData = useMemo(() => {
        if (!data) return [];

        return data.filter(item => {
            // Data is strictly fetched by Author now, so we trust ownership.

            // 1. Sector Check (Client Side)
            if (activeSector) {
                const anyItem = item as any;
                // Check possible field names for sectors in DTO
                const sectores = anyItem.sectoresObjetivo || anyItem.sectores;

                // If data is missing sector info, we can't filter positively, so we hide it to respect the filter.
                if (!sectores || !Array.isArray(sectores)) return false;

                const hasSector = sectores.some((s: any) => s.id === activeSector);
                if (!hasSector) return false;
            }

            // 2. Risk Check
            if (activeRiesgo) {
                const riesgoStr = getRiesgoString(activeRiesgo);
                if (item.riesgo !== riesgoStr) return false;
            }

            // 3. Horizon Check
            if (activeHorizonte) {
                const horizonStr = getHorizonteString(activeHorizonte);
                if (item.horizonte !== horizonStr) return false;
            }

            return true;
        });
    }, [data, user?.id, activeRiesgo, activeHorizonte, activeSector]);


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

                {!loading && !error && displayedData.length === 0 && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        No tienes recomendaciones registradas con estos filtros.
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {displayedData.map((item) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                            <RecomendacionCard item={item} showStatus={true} />
                        </Grid>
                    ))}
                </Grid>
            </main>
        </RoleGuard>
    );
}
