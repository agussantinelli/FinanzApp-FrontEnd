"use client";

import React, { useMemo, useState } from "react";
import {
    Typography, Box, TextField, Button, Grid, Paper, Divider,
    MenuItem, Select, InputLabel, FormControl, Autocomplete, IconButton, FormHelperText,
    InputAdornment, Backdrop
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LayersIcon from '@mui/icons-material/Layers';
import { useRouter } from "next/navigation";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RolUsuario } from "@/types/Usuario";
import PageHeader from "@/components/ui/PageHeader";
import { searchActivos } from "@/services/ActivosService";
import { ActivoDTO } from "@/types/Activo";
import { Riesgo, Horizonte, AccionRecomendada } from "@/types/Recomendacion";
import { debounce } from "@mui/material/utils";

import styles from "./styles/RealizarRecomendacion.module.css";
import { useCrearRecomendacion } from "@/hooks/useCrearRecomendacion";
import FloatingMessage from "@/components/ui/FloatingMessage";
import NeonLoader from "@/components/ui/NeonLoader";

interface AssetSearchProps {
    value: ActivoDTO | null;
    onChange: (val: ActivoDTO | null) => void;
    error?: boolean;
}

const AssetSearch: React.FC<AssetSearchProps> = ({ value, onChange, error }) => {
    const [options, setOptions] = useState<ActivoDTO[]>([]);

    const handleSearch = useMemo(
        () => debounce(async (input: string) => {
            if (input.length < 2) return;
            try {
                const results = await searchActivos(input);
                setOptions(results);
            } catch (e) {
                console.error(e);
            }
        }, 400),
        []
    );

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.symbol}
            filterOptions={(x) => x}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            onInputChange={(_, newInputValue) => handleSearch(newInputValue)}
            forcePopupIcon={false} // Make it look like a text input
            noOptionsText="Escribe para buscar..."
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Buscar Activo (Ticker)"
                    placeholder="Ej: AAPL, GGAL..."
                    error={error}
                    helperText={value ? value.nombre : ""}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    <Box>
                        <Typography variant="body2" fontWeight="bold">{option.symbol}</Typography>
                        <Typography variant="caption" color="text.secondary" ml={1}>{option.nombre}</Typography>
                    </Box>
                </li>
            )}
        />
    );
};


export default function CrearRecomendacionPage() {
    const router = useRouter();
    const {
        titulo, setTitulo,
        justificacion, setJustificacion,
        fuente, setFuente,
        riesgo, setRiesgo,
        horizonte, setHorizonte,
        selectedSectores, setSelectedSectores,
        availableSectores,
        assetRows,
        loading,
        errors,

        handleAddRow,
        handleRemoveRow,
        updateRow,
        handleSubmit,
        apiError, success, clearApiError, clearSuccess
    } = useCrearRecomendacion();

    return (
        <RoleGuard allowedRoles={[RolUsuario.Experto]}>
            <main className={styles.container}>
                <PageHeader
                    title="Nueva Recomendación"
                    subtitle="Crear"
                    description="Comparte tu análisis experto con la comunidad de inversores."
                />

                <Paper variant="outlined" className={styles.paper} sx={{ p: 4, borderRadius: 2 }}>

                    {/* General Info Section */}
                    <Box className={styles.formSection}>
                        <Typography variant="h5" className={styles.sectionTitle} gutterBottom>
                            <InfoOutlinedIcon color="secondary" />
                            Información General
                        </Typography>
                        <Grid container spacing={4} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Título de la Recomendación"
                                    fullWidth
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    error={!!errors.titulo}
                                    helperText={errors.titulo}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Justificación Lógica"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={justificacion}
                                    onChange={(e) => setJustificacion(e.target.value)}
                                    error={!!errors.justificacion}
                                    helperText={errors.justificacion}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Fuente (Opcional)"
                                    fullWidth
                                    value={fuente}
                                    onChange={(e) => setFuente(e.target.value)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Autocomplete
                                    multiple
                                    options={availableSectores}
                                    getOptionLabel={(option) => option.nombre}
                                    value={selectedSectores}
                                    onChange={(_, newValue) => setSelectedSectores(newValue)}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sectores Objetivo"
                                            error={!!errors.sectores}
                                            helperText={errors.sectores}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth error={!!errors.riesgo}>
                                    <InputLabel>Nivel de Riesgo</InputLabel>
                                    <Select
                                        value={riesgo}
                                        label="Nivel de Riesgo"
                                        onChange={(e) => setRiesgo(e.target.value as Riesgo)}
                                    >
                                        <MenuItem value={Riesgo.Conservador}>Conservador</MenuItem>
                                        <MenuItem value={Riesgo.Moderado}>Moderado</MenuItem>
                                        <MenuItem value={Riesgo.Agresivo}>Agresivo</MenuItem>
                                        <MenuItem value={Riesgo.Especulativo}>Especulativo</MenuItem>
                                    </Select>
                                    {errors.riesgo && <FormHelperText>{errors.riesgo}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth error={!!errors.horizonte}>
                                    <InputLabel>Horizonte de Inversión</InputLabel>
                                    <Select
                                        value={horizonte}
                                        label="Horizonte de Inversión"
                                        onChange={(e) => setHorizonte(e.target.value as Horizonte)}
                                    >
                                        <MenuItem value={Horizonte.Intradia}>Intradía</MenuItem>
                                        <MenuItem value={Horizonte.Corto}>Corto Plazo</MenuItem>
                                        <MenuItem value={Horizonte.Mediano}>Mediano Plazo</MenuItem>
                                        <MenuItem value={Horizonte.Largo}>Largo Plazo</MenuItem>
                                    </Select>
                                    {errors.horizonte && <FormHelperText>{errors.horizonte}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Assets Section */}
                    <Box className={styles.formSection}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5" className={styles.sectionTitle}>
                                <LayersIcon color="secondary" />
                                Activos Recomendados
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleAddRow}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Agregar Activo
                            </Button>
                        </Box>

                        {errors.assets && <Typography color="error" variant="body2" mb={2}>{errors.assets}</Typography>}

                        {assetRows.map((row, index) => (
                            <Box key={row.tempId} className={styles.assetCard} sx={{ mb: 3, p: 2 }}>
                                <Grid container spacing={3} alignItems="center">
                                    {/* Row 1: Ticker and Action */}
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <AssetSearch
                                            value={row.activo}
                                            onChange={(val) => updateRow(row.tempId, 'activo', val)}
                                            error={!!errors[`asset_${index}_activ`]}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <FormControl fullWidth error={!!errors[`asset_${index}_acc`]}>
                                            <InputLabel>Acción</InputLabel>
                                            <Select
                                                value={row.accion}
                                                label="Acción"
                                                onChange={(e) => updateRow(row.tempId, 'accion', e.target.value)}
                                            >
                                                <MenuItem value={AccionRecomendada.Comprar}>Comprar</MenuItem>
                                                <MenuItem value={AccionRecomendada.CompraFuerte}>Compra Fuerte</MenuItem>
                                                <MenuItem value={AccionRecomendada.Mantener}>Mantener</MenuItem>
                                                <MenuItem value={AccionRecomendada.Vender}>Vender</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 2: Prices */}
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Precio Actual"
                                            type="number"
                                            fullWidth
                                            value={row.precioAlRecomendar}
                                            onChange={(e) => updateRow(row.tempId, 'precioAlRecomendar', e.target.value)}
                                            error={!!errors[`asset_${index}_pAR`]}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Target"
                                            type="number"
                                            fullWidth
                                            value={row.precioObjetivo}
                                            onChange={(e) => updateRow(row.tempId, 'precioObjetivo', e.target.value)}
                                            error={!!errors[`asset_${index}_pO`]}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><TrendingUpIcon fontSize="small" /></InputAdornment>,
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="Stop Loss"
                                            type="number"
                                            fullWidth
                                            value={row.stopLoss}
                                            onChange={(e) => updateRow(row.tempId, 'stopLoss', e.target.value)}
                                            error={!!errors[`asset_${index}_sL`]}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start" sx={{ color: 'error.main' }}>!</InputAdornment>,
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 1 }} display="flex" justifyContent="flex-end">
                                        <IconButton
                                            onClick={() => handleRemoveRow(row.tempId)}
                                            color="error"
                                            disabled={assetRows.length === 1}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Box>

                    <Box className={styles.actions}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => router.back()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Creando..." : "Publicar Recomendación"}
                        </Button>
                    </Box>
                </Paper>

                <FloatingMessage
                    open={!!apiError}
                    message={apiError}
                    severity="error"
                    onClose={clearApiError}
                />
                <FloatingMessage
                    open={!!success}
                    message={success}
                    severity="success"
                    onClose={clearSuccess}
                />

                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)' // Darker background for better neon contrast
                    }}
                    open={loading}
                >
                    <NeonLoader message="Validando con IA..." size={80} />
                </Backdrop>
            </main>
        </RoleGuard >
    );
}
