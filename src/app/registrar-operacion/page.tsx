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

import styles from "./styles/RegistrarOperacion.module.css";

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
        moneda, setMoneda,
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
            <Box className={styles.container}>
                <Container maxWidth="md">
                    <Paper className={styles.paper}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                                Registrar Operación
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Completa los datos de tu compra, venta o dividendo.
                            </Typography>
                        </Box>
                        <Box className={styles.modeSelector}>
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
                            <Box>
                                <Typography variant="h6" color="primary" className={styles.sectionTitle}>
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

                            <Box>
                                <Typography variant="h6" color="primary" className={styles.sectionTitle}>
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

                            <Box>
                                <Typography variant="h6" color="primary" className={styles.sectionTitle}>
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
                                                        className={styles.maxButton}
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

                                    <Stack direction="row" spacing={2}>
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
                                        <FormControl sx={{ minWidth: 120 }}>
                                            <InputLabel>Moneda</InputLabel>
                                            <Select
                                                value={moneda}
                                                label="Moneda"
                                                onChange={(e) => setMoneda(e.target.value)}
                                            >
                                                <MenuItem value="ARS">ARS</MenuItem>
                                                <MenuItem value="USD">USD</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Stack>
                            </Box>

                            <Paper variant="outlined" className={styles.summaryPaper}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>TOTAL ESTIMADO</Typography>
                                <Typography variant="h3" className={styles.totalAmount}>
                                    {moneda === 'USD' ? 'USD' : '$'} {totalEstimado.toLocaleString("es-AR")}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                    Moneda seleccionada: {moneda}
                                </Typography>
                            </Paper>

                            <Stack direction="row" justifyContent="flex-end" spacing={2} className={styles.actionStack}>
                                <Button variant="text" size="large" onClick={() => router.back()}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={styles.actionButton}
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
