"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Box, Paper, Typography, Container, Grid, TextField, Button,
    ToggleButton, ToggleButtonGroup, Autocomplete, InputAdornment,
    FormControl, InputLabel, Select, MenuItem, CircularProgress,
    Stack, Chip, Alert
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";
import PageHeader from "@/components/ui/PageHeader";

import { searchActivos } from "@/services/ActivosService";
import { createOperacion } from "@/services/OperacionesService";
import { ActivoDTO } from "@/types/Activo";
import { TipoOperacion, CreateOperacionDTO } from "@/types/Operacion";
import { debounce } from "@mui/material/utils";

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function RegistrarOperacionPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [mode, setMode] = useState<"actual" | "historica">("actual");
    const [asset, setAsset] = useState<ActivoDTO | null>(null);
    const [options, setOptions] = useState<ActivoDTO[]>([]);

    // Form States
    const [tipo, setTipo] = useState<TipoOperacion>(TipoOperacion.Compra);
    const [cantidad, setCantidad] = useState<string>("");
    const [precio, setPrecio] = useState<string>("");

    // Initial date handling
    const getLocalISOString = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const [fecha, setFecha] = useState<string>(getLocalISOString());

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Asset Search Logic
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

    // Dynamic Updates based on Mode/Asset
    useEffect(() => {
        if (mode === "actual") {
            // Keep date updated to "now" if user hasn't manually selected yet (or force it)
            // But usually just force "now" behavior on submit or display "Now"
            // For UX, let's update it once when mode switches or just keep it editable but defaulted to now
            setFecha(getLocalISOString());

            if (asset?.precioActual) {
                setPrecio(asset.precioActual.toString());
            }
        }
    }, [mode, asset]);

    const handleSubmit = async () => {
        if (!user || !asset || !cantidad || !precio || !fecha) {
            setError("Completa todos los campos obligatorios.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const dto: CreateOperacionDTO = {
                personaId: user.id,
                activoId: asset.id,
                tipo: tipo,
                cantidad: Number(cantidad),
                precioUnitario: Number(precio),
                monedaOperacion: asset.moneda || "ARS",
                fechaOperacion: new Date(fecha).toISOString(),
            };

            await createOperacion(dto);
            router.push("/portfolio");
        } catch (err) {
            console.error(err);
            setError("Error al registrar la operación. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const totalEstimado = (Number(precio) || 0) * (Number(cantidad) || 0);

    return (
        <RoleGuard>
            <Box sx={{ py: 4, minHeight: '80vh' }}>
                <Container maxWidth="md">
                    <PageHeader
                        title="Registrar Operación"
                        subtitle="Nueva Transacción"
                        description="Ingresa los detalles de tu compra o venta."
                    />

                    <Paper sx={{ p: 4, mt: 3, borderRadius: 2 }}>
                        {/* 1. Mode Selector */}
                        <Box display="flex" justifyContent="center" mb={4}>
                            <ToggleButtonGroup
                                value={mode}
                                exclusive
                                onChange={(_, newMode) => { if (newMode) setMode(newMode); }}
                                aria-label="modo de operación"
                                color="primary"
                            >
                                <ToggleButton value="actual" sx={{ px: 3 }}>
                                    <AccessTimeIcon sx={{ mr: 1 }} />
                                    Monitor de Mercado (Actual)
                                </ToggleButton>
                                <ToggleButton value="historica" sx={{ px: 3 }}>
                                    <CalendarTodayIcon sx={{ mr: 1 }} />
                                    Registro Histórico
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* 2. Form Grid */}
                        <Grid container spacing={3}>
                            {/* Asset Search */}
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={options}
                                    getOptionLabel={(option) => option.symbol}
                                    filterOptions={(x) => x}
                                    value={asset}
                                    onChange={(_, newValue) => setAsset(newValue)}
                                    onInputChange={(_, newInputValue) => handleSearch(newInputValue)}
                                    noOptionsText="Escribe para buscar..."
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Buscar Activo (Ticker o Nombre)"
                                            placeholder="Ej: AAPL, BTC, GGAL"
                                            fullWidth
                                            helperText={asset ? asset.nombre : "Busca el activo que operaste"}
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
                            </Grid>

                            {/* Type (Buy/Sell) */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo de Operación</InputLabel>
                                    <Select
                                        value={tipo}
                                        label="Tipo de Operación"
                                        onChange={(e) => setTipo(e.target.value as TipoOperacion)}
                                    >
                                        <MenuItem value={TipoOperacion.Compra}>Compra</MenuItem>
                                        <MenuItem value={TipoOperacion.Venta}>Venta</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Date */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Fecha y Hora"
                                    type="datetime-local"
                                    fullWidth
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    disabled={mode === "actual"}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Quantity */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Cantidad"
                                    type="number"
                                    fullWidth
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><ShoppingCartIcon fontSize="small" /></InputAdornment>,
                                    }}
                                />
                            </Grid>

                            {/* Price */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Precio Unitario"
                                    type="number"
                                    fullWidth
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    disabled={mode === "actual" && !!asset?.precioActual} // Auto-filled if actual
                                    helperText={mode === "actual" ? "Precio de mercado actual" : "Precio al momento de operar"}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                            </Grid>

                            {/* Total Summary */}
                            <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">Total Operación Estimado</Typography>
                                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                                        $ {totalEstimado.toLocaleString("es-AR")}
                                    </Typography>
                                    {asset && <Typography variant="caption">{asset.moneda || "ARS"}</Typography>}
                                </Paper>
                            </Grid>

                            {error && (
                                <Grid item xs={12}>
                                    <Alert severity="error">{error}</Alert>
                                </Grid>
                            )}

                            {/* Actions */}
                            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                                <Button variant="text" onClick={() => router.back()}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={loading || !asset || !cantidad || !precio}
                                >
                                    {loading ? "Registrando..." : "Confirmar Operación"}
                                </Button>
                            </Grid>

                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </RoleGuard>
    );
}
