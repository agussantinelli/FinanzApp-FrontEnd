
"use client";

import React from "react";
import {
    Grid, Box, CircularProgress, Alert, Button,
    Paper, Select, InputLabel, FormControl, MenuItem
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

import { RolUsuario } from "@/types/Usuario";
import { useMisRecomendaciones } from '@/hooks/useMisRecomendaciones';
import RecomendacionCard from '@/components/cards/RecomendacionCard';
import PageHeader from '@/components/ui/PageHeader';
import { RoleGuard } from "@/components/auth/RoleGuard";
import FloatingMessage from "@/components/ui/FloatingMessage";

import styles from "../styles/Recomendaciones.module.css";

const MisRecomendacionesContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const targetUserId = searchParams.get('userId');
    const isViewingOther = !!targetUserId;

    const {
        displayedData,
        loading,
        error,
        sectores,
        selectedSector, setSelectedSector,
        selectedHorizonte, setSelectedHorizonte,
        selectedRiesgo, setSelectedRiesgo,
        handleApply,
        handleClear
    } = useMisRecomendaciones(targetUserId || undefined);

    return (
        <RoleGuard allowedRoles={[RolUsuario.Experto, RolUsuario.Admin]}>
            <main className={styles.container}>
                <PageHeader
                    title={isViewingOther ? "Recomendaciones del Usuario" : "Mis Recomendaciones"}
                    subtitle={isViewingOther ? "Perfil Externo" : "Gestión"}
                    description={isViewingOther ? "Explora el historial de recomendaciones de este experto." : "Revisa el estado de tus recomendaciones y su rendimiento."}
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

                <FloatingMessage
                    open={!!error}
                    message={error || ""}
                    severity="error"
                    onClose={() => { }}
                />

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

export default function MisRecomendacionesPage() {
    return (
        <React.Suspense fallback={
            <Box display="flex" justifyContent="center" my={5}>
                <CircularProgress />
            </Box>
        }>
            <MisRecomendacionesContent />
        </React.Suspense>
    );
}
