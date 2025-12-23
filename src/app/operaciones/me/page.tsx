"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Chip,
    Stack,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TableSortLabel
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { formatARS, formatUSD, formatQuantity, formatDateTime } from "@/utils/format";
import { useMyOperations, Order, FilterType, CurrencyFilterType } from "@/hooks/useMyOperations";
import { OperacionResponseDTO } from "@/types/Operacion";

import styles from "./styles/MyOperations.module.css";

export default function MyOperationsPage() {
    const router = useRouter();
    const {
        operaciones,
        loading,
        user,
        orderBy,
        order,
        filterType,
        setFilterType,
        filterCurrency,
        setFilterCurrency,
        handleRequestSort
    } = useMyOperations();

    if (!user) return null;

    return (
        <RoleGuard>
            <Box className={styles.container}>
                <Container maxWidth="xl">
                    <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} className={styles.header} justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
                                Volver
                            </Button>
                            <Box>
                                <Typography variant="h4" className={styles.headerTitle}>
                                    Mis Operaciones
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Historial completo de tus movimientos
                                </Typography>
                            </Box>
                        </Stack>

                        <Box sx={{ minWidth: 200, display: 'flex', gap: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={filterType}
                                    label="Tipo"
                                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                                >
                                    <MenuItem value="TODAS">Todas</MenuItem>
                                    <MenuItem value="Compra">Compras</MenuItem>
                                    <MenuItem value="Venta">Ventas</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel>Moneda</InputLabel>
                                <Select
                                    value={filterCurrency}
                                    label="Moneda"
                                    onChange={(e) => setFilterCurrency(e.target.value as CurrencyFilterType)}
                                >
                                    <MenuItem value="TODAS">Todas</MenuItem>
                                    <MenuItem value="ARS">Pesos</MenuItem>
                                    <MenuItem value="USD">Dólares</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>

                    <Paper className={styles.tablePaper}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress />
                            </Box>
                        ) : operaciones.length === 0 ? (
                            <Box className={styles.noDataContainer}>
                                <Typography variant="h6" color="text.secondary">
                                    No tienes operaciones registradas.
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'fecha'}
                                                    direction={orderBy === 'fecha' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('fecha')}
                                                >
                                                    Fecha
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="left">
                                                Tipo
                                            </TableCell>
                                            <TableCell align="left">
                                                Moneda
                                            </TableCell>
                                            <TableCell align="left">
                                                <TableSortLabel
                                                    active={orderBy === 'activoSymbol'}
                                                    direction={orderBy === 'activoSymbol' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('activoSymbol')}
                                                >
                                                    Activo
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="left">
                                                <TableSortLabel
                                                    active={orderBy === 'cantidad'}
                                                    direction={orderBy === 'cantidad' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('cantidad')}
                                                >
                                                    Cantidad
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="left">
                                                <TableSortLabel
                                                    active={orderBy === 'precioUnitario'}
                                                    direction={orderBy === 'precioUnitario' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('precioUnitario')}
                                                >
                                                    Precio
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="left">
                                                <TableSortLabel
                                                    active={orderBy === 'totalOperado'}
                                                    direction={orderBy === 'totalOperado' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('totalOperado')}
                                                >
                                                    Total
                                                </TableSortLabel>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {operaciones.map((op) => {
                                            const isCompra = op.tipo === "Compra";
                                            const isARS = op.moneda === "ARS";
                                            const formatMoney = isARS ? formatARS : formatUSD;

                                            return (
                                                <TableRow key={op.id} hover>
                                                    <TableCell>
                                                        {formatDateTime(op.fecha)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={op.tipo}
                                                            color={isCompra ? "success" : "error"}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant="body2">{op.moneda}</Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography fontWeight="bold">{op.activoSymbol}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{op.activoNombre}</Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {formatQuantity(op.cantidad)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {formatMoney(op.precioUnitario)}
                                                    </TableCell>
                                                    <TableCell align="left" className={styles.boldCell}>
                                                        {formatMoney(op.totalOperado)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Container>
            </Box>
        </RoleGuard >
    );
}
