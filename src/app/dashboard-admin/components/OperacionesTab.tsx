import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Typography, Chip, Skeleton } from '@mui/material';
import { useAdminOperations } from '@/hooks/useAdminOperations';
import styles from '../styles/Admin.module.css';

export default function OperacionesTab() {
    const { operations, loading } = useAdminOperations();

    if (loading) return <Skeleton variant="rectangular" height={400} />;

    return (
        <Box sx={{ py: 3 }}>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell>ID Op</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {operations.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>#{row.id.substring(0, 8)}</TableCell>
                                <TableCell>{row.personaNombre}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.tipo}
                                        size="small"
                                        color={row.tipo === 'Compra' ? 'success' : 'error'}
                                        variant="soft"
                                        className={styles.chip}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2" fontWeight={600}>{row.activoSymbol}</Typography>
                                        <Typography variant="caption" color="text.secondary">{row.activoNombre}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.cantidad}</TableCell>
                                <TableCell>${row.precioUnitario}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>${row.totalOperado.toLocaleString()}</TableCell>
                                <TableCell>{new Date(row.fecha).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
