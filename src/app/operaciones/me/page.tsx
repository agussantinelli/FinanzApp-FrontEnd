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
import { useMyOperations, Order, FilterType } from "@/hooks/useMyOperations";
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
        handleRequestSort
    } = useMyOperations();

    if (!user) return null;

    return (
        <RoleGuard>
            <Box className={styles.container}>
                <Container maxWidth="lg">
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

                        <Box sx={{ minWidth: 200 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Tipo de Operación</InputLabel>
                                <Select
                                    value={filterType}
                                    label="Tipo de Operación"
                                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                                >
                                    <MenuItem value="TODAS">Todas</MenuItem>
                                    <MenuItem value="Compra">Compras</MenuItem>
                                    <MenuItem value="Venta">Ventas</MenuItem>
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
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'tipo'}
                                                    direction={orderBy === 'tipo' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('tipo')}
                                                >
                                                    Tipo
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'activoSymbol'}
                                                    direction={orderBy === 'activoSymbol' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('activoSymbol')}
                                                >
                                                    Activo
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="right">
                                                <TableSortLabel
                                                    active={orderBy === 'cantidad'}
                                                    direction={orderBy === 'cantidad' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('cantidad')}
                                                >
                                                    Cantidad
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="right">
                                                <TableSortLabel
                                                    active={orderBy === 'precioUnitario'}
                                                    direction={orderBy === 'precioUnitario' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('precioUnitario')}
                                                >
                                                    Precio
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="right">
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
                                                    <TableCell>
                                                        <Typography fontWeight="bold">{op.activoSymbol}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{op.activoNombre}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatQuantity(op.cantidad)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatMoney(op.precioUnitario)}
                                                    </TableCell>
                                                    <TableCell align="right" className={styles.boldCell}>
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
        </RoleGuard>
    );
}
