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
    Button
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { formatARS, formatUSD, formatQuantity, formatDateTime } from "@/utils/format";
import { useMyOperations } from "@/hooks/useMyOperations";

import styles from "./styles/MyOperations.module.css";

export default function MyOperationsPage() {
    const router = useRouter();
    const { operaciones, loading, user } = useMyOperations();

    if (!user) return null;

    return (
        <RoleGuard>
            <Box className={styles.container}>
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" spacing={2} className={styles.header}>
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
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Activo</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">Precio</TableCell>
                                            <TableCell align="right">Total</TableCell>
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
