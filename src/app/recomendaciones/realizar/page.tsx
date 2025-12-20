"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Typography, Box, TextField, Button, Grid, Paper, Divider,
    MenuItem, Select, InputLabel, FormControl, Autocomplete, IconButton, FormHelperText
} from "@mui/material";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { RoleGuard } from "@/components/auth/RoleGuard";
import { RolUsuario } from "@/types/Usuario";
import PageHeader from "@/components/ui/PageHeader";
import { getSectores } from "@/services/SectorService";
import { searchActivos } from "@/services/ActivosService";
import { createRecomendacion } from "@/services/RecomendacionesService";
import { SectorDTO } from "@/types/Sector";
import { ActivoDTO } from "@/types/Activo";
import { Riesgo, Horizonte, AccionRecomendada, CrearRecomendacionDTO } from "@/types/Recomendacion";
import { debounce } from "@mui/material/utils";

import styles from "./styles/CrearRecomendacion.module.css";

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
            filterOptions={(x) => x} // Disable client filtering
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            onInputChange={(_, newInputValue) => handleSearch(newInputValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Activo"
                    error={error}
                    helperText={value ? value.nombre : ""}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    <Box>
                        <Typography variant="body2" fontWeight="bold">{option.symbol}</Typography>
                        <Typography variant="caption" color="text.secondary">{option.nombre}</Typography>
                    </Box>
                </li>
            )}
        />
    );
};

// --- Main Page ---

interface AssetRow {
    tempId: number;
    activo: ActivoDTO | null;
    precioAlRecomendar: string;
    precioObjetivo: string;
    stopLoss: string;
    accion: AccionRecomendada | "";
}

export default function CrearRecomendacionPage() {
    const router = useRouter();

    // Form States
    const [titulo, setTitulo] = useState("");
    const [justificacion, setJustificacion] = useState("");
    const [fuente, setFuente] = useState("");
    const [riesgo, setRiesgo] = useState<Riesgo | "">("");
    const [horizonte, setHorizonte] = useState<Horizonte | "">("");
    const [selectedSectores, setSelectedSectores] = useState<SectorDTO[]>([]);

    const [availableSectores, setAvailableSectores] = useState<SectorDTO[]>([]);
    const [assetRows, setAssetRows] = useState<AssetRow[]>([]);

    // UI States
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        getSectores().then(setAvailableSectores).catch(console.error);
        setAssetRows([{ tempId: Date.now(), activo: null, precioAlRecomendar: "", precioObjetivo: "", stopLoss: "", accion: "" }]);
    }, []);

    const handleAddRow = () => {
        setAssetRows(prev => [...prev, { tempId: Date.now(), activo: null, precioAlRecomendar: "", precioObjetivo: "", stopLoss: "", accion: "" }]);
    };

    const handleRemoveRow = (tempId: number) => {
        setAssetRows(prev => prev.filter(r => r.tempId !== tempId));
    };

    const updateRow = (tempId: number, field: keyof AssetRow, value: any) => {
        setAssetRows(prev => prev.map(r => r.tempId === tempId ? { ...r, [field]: value } : r));
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!titulo.trim()) newErrors.titulo = "El título es requerido";
        if (!justificacion.trim()) newErrors.justificacion = "La justificación es requerida";
        if (!riesgo) newErrors.riesgo = "El riesgo es requerido";
        if (!horizonte) newErrors.horizonte = "El horizonte es requerido";
        if (selectedSectores.length === 0) newErrors.sectores = "Selecciona al menos un sector";

        if (assetRows.length === 0) {
            newErrors.assets = "Debe haber al menos un activo recomendado";
        } else {
            assetRows.forEach((row, index) => {
                if (!row.activo) newErrors[`asset_${index}_activ`] = "Selecciona un activo";
                if (!row.precioAlRecomendar) newErrors[`asset_${index}_pAR`] = "Requerido";
                if (!row.precioObjetivo) newErrors[`asset_${index}_pO`] = "Requerido";
                if (!row.stopLoss) newErrors[`asset_${index}_sL`] = "Requerido";
                if (!row.accion) newErrors[`asset_${index}_acc`] = "Requerido";
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);

        try {
            const dto: CrearRecomendacionDTO = {
                titulo,
                justificacionLogica: justificacion,
                fuente,
                riesgo: Number(riesgo),
                horizonte: Number(horizonte),
                sectoresObjetivo: selectedSectores.map(s => ({ id: s.id })),
                detalles: assetRows.map(r => ({
                    activoId: r.activo!.id,
                    precioAlRecomendar: Number(r.precioAlRecomendar),
                    precioObjetivo: Number(r.precioObjetivo),
                    stopLoss: Number(r.stopLoss),
                    accion: Number(r.accion),
                }))
            };

            await createRecomendacion(dto);
            router.push("/recomendaciones");
        } catch (error) {
            console.error(error);
            // Could add a global alert here
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard allowedRoles={[RolUsuario.Experto]}>
            <main className={styles.container}>
                <PageHeader
                    title="Nueva Recomendación"
                    subtitle="Crear"
                    description="Comparte tu análisis experto con la comunidad de inversores."
                />

                <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>

                    {/* General Info Section */}
                    <Box className={styles.formSection}>
                        <Typography variant="h6" gutterBottom color="primary">Información General</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Título de la Recomendación"
                                    fullWidth
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    error={!!errors.titulo}
                                    helperText={errors.titulo}
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Fuente (Opcional)"
                                    fullWidth
                                    value={fuente}
                                    onChange={(e) => setFuente(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
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

                            <Grid item xs={12} md={6}>
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

                            <Grid item xs={12} md={6}>
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
                            <Typography variant="h6" color="primary">Activos Recomendados</Typography>
                            <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddRow}>
                                Agregar Activo
                            </Button>
                        </Box>

                        {errors.assets && <Typography color="error" variant="body2" mb={2}>{errors.assets}</Typography>}

                        {assetRows.map((row, index) => (
                            <Box key={row.tempId} className={styles.assetCard}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={3}>
                                        <AssetSearch
                                            value={row.activo}
                                            onChange={(val) => updateRow(row.tempId, 'activo', val)}
                                            error={!!errors[`asset_${index}_activ`]}
                                        />
                                    </Grid>

                                    <Grid item xs={6} md={2}>
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

                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            label="Precio Actual"
                                            type="number"
                                            fullWidth
                                            value={row.precioAlRecomendar}
                                            onChange={(e) => updateRow(row.tempId, 'precioAlRecomendar', e.target.value)}
                                            error={!!errors[`asset_${index}_pAR`]}
                                        />
                                    </Grid>

                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            label="Target"
                                            type="number"
                                            fullWidth
                                            value={row.precioObjetivo}
                                            onChange={(e) => updateRow(row.tempId, 'precioObjetivo', e.target.value)}
                                            error={!!errors[`asset_${index}_pO`]}
                                        />
                                    </Grid>

                                    <Grid item xs={6} md={2}>
                                        <TextField
                                            label="Stop Loss"
                                            type="number"
                                            fullWidth
                                            value={row.stopLoss}
                                            onChange={(e) => updateRow(row.tempId, 'stopLoss', e.target.value)}
                                            error={!!errors[`asset_${index}_sL`]}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={1} display="flex" justifyContent="center">
                                        <IconButton onClick={() => handleRemoveRow(row.tempId)} color="error" disabled={assetRows.length === 1}>
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
            </main>
        </RoleGuard>
    );
}
