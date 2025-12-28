"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Typography, Grid, Box, CircularProgress, Alert, TextField, Button,
    FormControlLabel, Checkbox, Paper, Autocomplete, MenuItem, Select,
    InputLabel, FormControl
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RolUsuario } from "@/types/Usuario";
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import RecomendacionCard from '@/components/cards/RecomendacionCard';
import PageHeader from '@/components/ui/PageHeader';
import styles from "./styles/Recomendaciones.module.css";
import FilterListIcon from '@mui/icons-material/FilterList';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { getSectores } from "@/services/SectorService";
import { searchActivos } from "@/services/ActivosService";
import { SectorDTO } from "@/types/Sector";
import { ActivoDTO } from "@/types/Activo";
import { EstadoRecomendacion } from "@/types/Recomendacion";
import { aprobarRecomendacion, rechazarRecomendacion } from "@/services/RecomendacionesService";
import { debounce } from "@mui/material/utils";

export default function RecomendacionesPage() {
    const { data, loading, error, filters, applyFilters, clearFilters, refresh } = useRecomendaciones();
    const { user } = useAuth();
    const router = useRouter();

    const [sectores, setSectores] = useState<SectorDTO[]>([]);
    const [assetOptions, setAssetOptions] = useState<ActivoDTO[]>([]);

    const [selectedSector, setSelectedSector] = useState(filters.sectorId || "");
    const [selectedAutor, setSelectedAutor] = useState(filters.autorId || "");
    const [selectedHorizonte, setSelectedHorizonte] = useState(filters.horizonteId || "");
    const [selectedRiesgo, setSelectedRiesgo] = useState(filters.riesgoId || "");
    const [selectedAsset, setSelectedAsset] = useState<ActivoDTO | null>(null);
    const [selectedState, setSelectedState] = useState<number | string>(EstadoRecomendacion.Aceptada);

    const isAdmin = user?.rol === RolUsuario.Admin;

    const handleApprove = async (id: string) => {
        try {
            await aprobarRecomendacion(id);
            refresh();
        } catch (e) {
            console.error(e);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rechazarRecomendacion(id);
            refresh();
        } catch (e) {
            console.error(e);
        }
    };

    const authors = useMemo(() => {
        const uniqueAuthors: { id: string, nombre: string }[] = [];
        const seen = new Set();

        if (data && data.length > 0) {
            data.forEach(r => {
                const id = r.autorId || r.autorNombre;
                const nombre = r.autorNombre;

                if (id && nombre && !seen.has(id)) {
                    seen.add(id);
                    uniqueAuthors.push({ id, nombre });
                }
            });
        }
        return uniqueAuthors;
    }, [data]);

    useEffect(() => {
        getSectores().then(setSectores).catch(console.error);
    }, []);

    const handleAssetSearch = useMemo(
        () => debounce(async (input: string, callback: (results: ActivoDTO[]) => void) => {
            if (input.length < 2) {
                callback([]);
                return;
            }
            try {
                const results = await searchActivos(input);
                callback(results);
            } catch (e) {
                console.error(e);
                callback([]);
            }
        }, 400),
        []
    );

    const onAssetInputChange = (event: any, newInputValue: string) => {
        handleAssetSearch(newInputValue, (results) => {
            setAssetOptions(results);
        });
    };

    const handleApply = () => {
        applyFilters({
            sectorId: selectedSector || undefined,
            autorId: selectedAutor || undefined,
            horizonteId: selectedHorizonte ? Number(selectedHorizonte) : undefined,
            riesgoId: selectedRiesgo ? Number(selectedRiesgo) : undefined,
            activoId: selectedAsset?.id || undefined,
            adminStateFilter: (isAdmin && selectedState !== "") ? Number(selectedState) : undefined
        });
    };

    const handleClear = () => {
        clearFilters();
        setSelectedSector("");
        setSelectedAutor("");
        setSelectedHorizonte("");
        setSelectedRiesgo("");
        setSelectedAsset(null);
    };

    return (
        <main className={styles.container}>
            <PageHeader
                title="Recomendaciones"
                subtitle="Opinión Experta"
                description="Descubre estrategias de inversión diseñadas por profesionales."
            >
                {(user?.rol === RolUsuario.Experto || user?.rol === RolUsuario.Admin) && (
                    <Box display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<AssignmentIndIcon />}
                            onClick={() => router.push('/recomendaciones/me')}
                            sx={{ whiteSpace: 'nowrap', borderRadius: 2, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                        >
                            Mis Recomendaciones
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/recomendaciones/realizar')}
                            sx={{ whiteSpace: 'nowrap', px: 3, borderRadius: 2 }}
                        >
                            Realizar Recomendación
                        </Button>
                    </Box>
                )}
                {isAdmin && (
                    <Box display="flex" gap={2} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={selectedState}
                                label="Estado"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedState(val);
                                    // Auto-apply logic for this specific filter since it's outside the main block
                                    applyFilters({
                                        sectorId: selectedSector || undefined,
                                        autorId: selectedAutor || undefined,
                                        horizonteId: selectedHorizonte ? Number(selectedHorizonte) : undefined,
                                        riesgoId: selectedRiesgo ? Number(selectedRiesgo) : undefined,
                                        activoId: selectedAsset?.id || undefined,
                                        adminStateFilter: (val !== "") ? Number(val) : undefined
                                    });
                                }}
                            >
                                <MenuItem value={EstadoRecomendacion.Aceptada}>Aceptadas</MenuItem>
                                <MenuItem value={EstadoRecomendacion.Pendiente}>Pendientes</MenuItem>
                                <MenuItem value=""><em>Todas</em></MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </PageHeader>

            <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={1.5} alignItems="center" columns={{ xs: 12, md: 14 }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            forcePopupIcon={false}
                            size="small"
                            options={assetOptions}
                            getOptionLabel={(option) => option.symbol}
                            filterOptions={(x) => x}
                            value={selectedAsset}
                            onChange={(event: any, newValue: ActivoDTO | null) => {
                                setSelectedAsset(newValue);
                            }}
                            onInputChange={onAssetInputChange}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">{option.symbol}</Typography>
                                        <Typography variant="caption" color="text.secondary">{option.nombre}</Typography>
                                    </Box>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Activo (Ticker)" fullWidth />
                            )}
                            noOptionsText="Buscar..."
                        />
                    </Grid>

                    {/* Admin State Filter */}


                    {/* Sector Filter - Smaller */}
                    <Grid size={{ xs: 12, md: 2 }} >
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

                    {/* Risk Filter - Smaller */}
                    <Grid size={{ xs: 12, md: 2 }}>
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

                    {/* Horizon Filter - Smaller */}
                    <Grid size={{ xs: 12, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Horizonte</InputLabel>
                            <Select
                                value={selectedHorizonte}
                                label="Horizonte"
                                onChange={(e) => setSelectedHorizonte(e.target.value)}
                            >
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                <MenuItem value={1}>Intradía  ( Hoy )</MenuItem>
                                <MenuItem value={2}>Corto  ( &lt; 6 meses )</MenuItem>
                                <MenuItem value={3}>Mediano  ( 6 - 18 meses )</MenuItem>
                                <MenuItem value={4}>Largo  ( &gt; 18 meses )</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Author Filter - Smaller */}
                    <Grid size={{ xs: 12, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Experto</InputLabel>
                            <Select
                                value={selectedAutor}
                                label="Experto"
                                onChange={(e) => setSelectedAutor(e.target.value)}
                            >
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {authors.map(a => (
                                    <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Actions - Larger to fit buttons */}
                    <Grid size={{ xs: 12, md: 3 }} display="flex" gap={1} justifyContent="flex-end">
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
                            Aplicar
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
                    No hay recomendaciones encontradas con estos filtros.
                </Alert>
            )}

            {/* Remove client-side filtering to allow Admin results (Pending/Rejected) to show */}
            <Grid container spacing={3}>
                {data.map((item) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                        <RecomendacionCard
                            item={item}
                            isAdmin={isAdmin}
                            onApprove={() => { handleApprove(item.id).then(() => window.location.reload()) }}
                            onReject={() => { handleReject(item.id).then(() => window.location.reload()) }}
                        />
                    </Grid>
                ))}
            </Grid>
        </main>
    );
}
