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

    // UI Metadata States
    const [sectores, setSectores] = useState<SectorDTO[]>([]);
    const [assetOptions, setAssetOptions] = useState<ActivoDTO[]>([]);

    // Local Filter States
    const [selectedSector, setSelectedSector] = useState(filters.sectorId || "");
    const [selectedAutor, setSelectedAutor] = useState(filters.autorId || "");
    const [selectedAsset, setSelectedAsset] = useState<ActivoDTO | null>(null);

    // Derived Authors from data (showing all possible authors from current view)
    const authors = useMemo(() => {
        const unique = new Map<string, { id: string, nombre: string, apellido: string }>();
        data.forEach(r => {
            if (!unique.has(r.persona.id)) {
                unique.set(r.persona.id, r.persona);
            }
        });
        return Array.from(unique.values());
    }, [data]);

    // Load Sectors on mount
    useEffect(() => {
        getSectores().then(setSectores).catch(console.error);
    }, []);

    // Asset Search Debounce
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
            activoId: selectedAsset?.id || undefined
        });
    };

    const handleClear = () => {
        clearFilters();
        setSelectedSector("");
        setSelectedAutor("");
        setSelectedAsset(null);
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
                <Grid container spacing={2} alignItems="center">
                    {/* Sector Filter */}
                    <Grid size={{ xs: 12, md: 3 }} >
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

                    {/* Author Filter */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Experto</InputLabel>
                            <Select
                                value={selectedAutor}
                                label="Experto"
                                onChange={(e) => setSelectedAutor(e.target.value)}
                            >
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {authors.map(a => (
                                    <MenuItem key={a.id} value={a.id}>{a.nombre} {a.apellido}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Asset Autocomplete */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Autocomplete
                            size="small"
                            options={assetOptions}
                            getOptionLabel={(option) => option.symbol} // Showing Symbol as main label
                            filterOptions={(x) => x} // Disable built-in filter, we filter server-side
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
                            noOptionsText="Escribe para buscar..."
                        />
                    </Grid>



                    {/* Actions */}
                    <Grid size={{ xs: 12 }} display="flex" gap={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            startIcon={<CleaningServicesIcon />}
                            onClick={handleClear}
                        >
                            Limpiar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<FilterListIcon />}
                            onClick={handleApply}
                        >
                            Aplicar Filtros
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
