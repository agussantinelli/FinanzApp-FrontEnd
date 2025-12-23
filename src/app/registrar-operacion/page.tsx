"use client";

import React, { Suspense } from "react";
import {
    Box, Paper, Typography, Container, TextField, Button,
    ToggleButton, ToggleButtonGroup, Autocomplete, InputAdornment,
    FormControl, InputLabel, Select, MenuItem, Stack
} from "@mui/material";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import PageHeader from "@/components/ui/PageHeader";
import FloatingMessage from "@/components/ui/FloatingMessage";
import NeonLoader from "@/components/ui/NeonLoader";

import { TipoOperacion } from "@/types/Operacion";
import { useRegistrarOperacion } from "@/hooks/useRegistrarOperacion";

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function RegistrarOperacionContent() {
    const router = useRouter();


    const {
        mode, setMode,
        asset, setAsset,
        options, handleSearch,
        portfolios, portfolioId, setPortfolioId, detailedPortfolio,
        tipo, setTipo,
        cantidad, setCantidad,
        precio, setPrecio,
        fecha, setFecha,
        loading, error, success,
        clearError, clearSuccess,
        handleSubmit,
        totalEstimado
    } = useRegistrarOperacion();

    const availableAsset = (tipo === TipoOperacion.Venta && asset && detailedPortfolio)
        ? detailedPortfolio.activos.find(a => a.symbol === asset.symbol)
        : null;

    return (
        <RoleGuard>
            <Box sx={{ py: 4, minHeight: '80vh' }}>
                <Container maxWidth="md">
                    {/* ... (Header and Paper content remains same) ... */}

                    <Paper sx={{ p: 4, mt: 3, borderRadius: 2 }}>
                        {/* 1. Mode Selector - existing code */}
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
                                            endAdornment: (availableAsset && availableAsset.cantidad > 0) ? (
                                                <InputAdornment position="end">
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        onClick={() => setCantidad(availableAsset.cantidad.toString())}
                                                        sx={{
                                                            color: 'success.main',
                                                            minWidth: 'auto',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.75rem',
                                                            p: 0.5,
                                                            textTransform: 'uppercase'
                                                        }}
                                                    >
                                                        MAX
                                                    </Button>
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        helperText={
                                            availableAsset ? (
                                                <Stack direction="row" spacing={1} component="span" sx={{ mt: 0.5 }}>
                                                    <Typography variant="caption" component="span" fontWeight="bold">
                                                        Disp: {availableAsset.cantidad}
                                                    </Typography>
                                                    <Typography variant="caption" component="span" color="text.secondary">•</Typography>
                                                    <Typography variant="caption" component="span">
                                                        PPC: ${availableAsset.precioPromedioCompra.toLocaleString("es-AR", { maximumFractionDigits: 2 })}
                                                    </Typography>
                                                </Stack>
                                            ) : (tipo === TipoOperacion.Venta && asset ? "No tienes este activo en el portafolio seleccionado." : null)
                                        }
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

                            {/* REMOVED STATIC ALERT */}

                            {/* ACTIONS */}
                            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                                <Button variant="text" size="large" onClick={() => router.back()}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{ px: 4 }}
                                >
                                    {loading ? "Registrando..." : "Confirmar Operación"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>

                    <FloatingMessage
                        open={!!error}
                        message={error}
                        severity="error"
                        onClose={clearError}
                    />
                    <FloatingMessage
                        open={!!success}
                        message={success}
                        severity="success"
                        onClose={clearSuccess}
                    />
                </Container>
            </Box>
        </RoleGuard>
    );
}

export default function RegistrarOperacionPage() {
    return (
        <Suspense fallback={<NeonLoader />}>
            <RegistrarOperacionContent />
        </Suspense>
    );
}
