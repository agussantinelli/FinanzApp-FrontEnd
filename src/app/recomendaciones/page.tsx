"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Typography, Grid, Box, CircularProgress, Alert, TextField, Button,
    FormControlLabel, Checkbox, Paper, Autocomplete, MenuItem, Select,
    InputLabel, FormControl
} from "@mui/material";
import { useRecomendaciones } from '@/hooks/useRecomendaciones';
import RecomendacionCard from '@/components/cards/RecomendacionCard';
import styles from "./styles/Recomendaciones.module.css";
import FilterListIcon from '@mui/icons-material/FilterList';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { getSectores } from "@/services/SectorService";
import { searchActivos } from "@/services/ActivosService";
import { SectorDTO } from "@/types/Sector";
import { ActivoDTO } from "@/types/Activo";
import { debounce } from "@mui/material/utils";

export default function RecomendacionesPage() {
    const { data, loading, error, filters, applyFilters, clearFilters } = useRecomendaciones();

    const [sectores, setSectores] = useState<SectorDTO[]>([]);
    const [assetOptions, setAssetOptions] = useState<ActivoDTO[]>([]);

    const [selectedSector, setSelectedSector] = useState(filters.sectorId || "");
    const [selectedAutor, setSelectedAutor] = useState(filters.autorId || "");
    const [selectedHorizonte, setSelectedHorizonte] = useState(filters.horizonteId || "");
    const [selectedRiesgo, setSelectedRiesgo] = useState(filters.riesgoId || "");
    const [selectedAsset, setSelectedAsset] = useState<ActivoDTO | null>(null);

    const authors = useMemo(() => {
        const uniqueAuthors: { id: string, nombre: string }[] = [];
        const seen = new Set();

        if (data && data.length > 0) {
            data.forEach(r => {
                // Determine ID: try autorId, fallback to autorNombre, lastly random (shouldn't happen if nombre exists)
                // We trust autorNombre matches display needs.
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
            activoId: selectedAsset?.id || undefined
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
            <Box mb={4}>
                <Typography variant="h3" component="h1" fontWeight="bold" className={styles.title} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                    Recomendaciones de Expertos
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Descubre estrategias de inversión diseñadas por profesionales.
                </Typography>
            </Box>

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
