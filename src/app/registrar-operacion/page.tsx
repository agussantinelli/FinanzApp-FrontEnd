"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Box, Paper, Typography, Container, TextField, Button,
    ToggleButton, ToggleButtonGroup, Autocomplete, InputAdornment,
    FormControl, InputLabel, Select, MenuItem, Stack, Alert
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";
import PageHeader from "@/components/ui/PageHeader";

import { searchActivos } from "@/services/ActivosService";
import { createOperacion } from "@/services/OperacionesService";
import { getMisPortafolios } from "@/services/PortafolioService";
import { ActivoDTO } from "@/types/Activo";
import { TipoOperacion, CreateOperacionDTO } from "@/types/Operacion";
import { PortafolioDTO } from "@/types/Portafolio";
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

    // Portfolio State
    const [portfolios, setPortfolios] = useState<PortafolioDTO[]>([]);
    const [portfolioId, setPortfolioId] = useState<string>("");

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

    // Fetch Portfolios
    useEffect(() => {
        getMisPortafolios()
            .then(data => {
                setPortfolios(data);
                if (data.length > 0) {
                    setPortfolioId(data[0].id);
                }
            })
            .catch(console.error);
    }, []);

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
            setFecha(getLocalISOString());
            // Updated to be just a suggestion, user can edit
            if (asset?.precioActual) {
                setPrecio(asset.precioActual.toString());
            }
        }
    }, [mode, asset]);

    const handleSubmit = async () => {
        if (!user || !asset || !cantidad || !precio || !fecha || !portfolioId) {
            setError("Completa todos los campos obligatorios.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const dto: CreateOperacionDTO = {
                personaId: user.id,
                activoId: asset.id,
                portafolioId: portfolioId,
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

                        <Stack spacing={4}>
                            {/* SECTION 1: ASSET & TYPE */}
                            <Box>
                                <Typography variant="h6" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ShoppingCartIcon fontSize="small" /> 1. Datos de la Operación
                                </Typography>
                                <Stack spacing={3}>
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

                                    <FormControl fullWidth>
                                        <InputLabel>Portafolio Destino</InputLabel>
                                        <Select
                                            value={portfolioId}
                                            label="Portafolio Destino"
                                            onChange={(e) => setPortfolioId(e.target.value)}
                                        >
                                            {portfolios.map((p) => (
                                                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

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
                                </Stack>
                            </Box>

                            {/* SECTION 2: DATE */}
                            <Box>
                                <Typography variant="h6" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarTodayIcon fontSize="small" /> 2. Fecha y Hora
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Fecha y Hora"
                                        type="datetime-local"
                                        fullWidth
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        disabled={mode === "actual"}
                                        InputLabelProps={{ shrink: true }}
                                        helperText={mode === "actual" ? "La fecha se registra automáticamente al confirmar." : "Selecciona cuándo ocurrió la operación."}
                                    />
                                </Stack>
                            </Box>

                            {/* SECTION 3: VALUES */}
                            <Box>
                                <Typography variant="h6" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoneyIcon fontSize="small" /> 3. Valores
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Cantidad Nominal"
                                        type="number"
                                        fullWidth
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value)}
                                        placeholder="Ej: 10"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">#</InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        label="Precio Unitario"
                                        type="number"
                                        fullWidth
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)}
                                        helperText={mode === "actual" ? "Precio de mercado actual (editable)" : "Precio histórico por unidad"}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                </Stack>
                            </Box>

                            {/* SECTION 4: SUMMARY */}
                            <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.default', textAlign: 'center', borderColor: 'primary.main', borderWidth: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>TOTAL ESTIMADO</Typography>
                                <Typography variant="h3" color="primary.main" fontWeight="bold">
                                    $ {totalEstimado.toLocaleString("es-AR")}
                                </Typography>
                                {asset && <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>Moneda: {asset.moneda || "ARS"}</Typography>}
                            </Paper>

                            {error && (
                                <Alert severity="error">{error}</Alert>
                            )}

                            {/* ACTIONS */}
                            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                                <Button variant="text" size="large" onClick={() => router.back()}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={loading || !asset || !cantidad || !precio || !portfolioId}
                                    sx={{ px: 4 }}
                                >
                                    {loading ? "Registrando..." : "Confirmar Operación"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </RoleGuard>
    );
}
