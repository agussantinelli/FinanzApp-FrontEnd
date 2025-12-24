import React, { useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminAssets } from '@/hooks/useAdminAssets';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import styles from '../styles/Admin.module.css';

export default function ActivosTab() {
    const { activos, loading, removeAsset } = useAdminAssets();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId && removeAsset) {
            await removeAsset(selectedId);
        }
        setConfirmOpen(false);
    };

    if (loading) return <Skeleton variant="rectangular" height={400} />;

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">Agregar Nuevo Activo</Button>
            </Box>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell>Símbolo</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Moneda</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activos.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>
                                    <Chip label={row.symbol} size="small" className={styles.chipSymbol} />
                                </TableCell>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell>{row.tipo}</TableCell>
                                <TableCell><Chip label={row.moneda} size="small" variant="outlined" /></TableCell>
                                <TableCell>
                                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteClick(row.id)}
                                        title="Eliminar Activo"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar Activo"
                content="¿Estás seguro de que deseas eliminar este activo? Esta acción no se puede deshacer."
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmText="Eliminar"
                confirmColor="error"
            />
        </Box>
    );
}
