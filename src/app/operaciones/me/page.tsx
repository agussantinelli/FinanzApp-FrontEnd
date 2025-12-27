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
    TableSortLabel,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { formatARS, formatUSD, formatQuantity, formatDateTime } from "@/utils/format";
import { useMyOperations, Order, FilterType, CurrencyFilterType } from "@/hooks/useMyOperations";
import { OperacionResponseDTO } from "@/types/Operacion";
import { deleteOperacion, updateOperacion } from "@/services/OperacionesService";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import FloatingMessage from "@/components/ui/FloatingMessage";

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
        handleRequestSort,
        refresh
    } = useMyOperations();

    // Delete State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [opToDelete, setOpToDelete] = useState<OperacionResponseDTO | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Edit State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingOp, setEditingOp] = useState<OperacionResponseDTO | null>(null);
    const [editValues, setEditValues] = useState({ cantidad: "", precio: "" });
    const [updating, setUpdating] = useState(false);

    // Feedback
    const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

    // DELETE HANDLERS
    const handleDeleteClick = (op: OperacionResponseDTO) => {
        setOpToDelete(op);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!opToDelete) return;
        setDeleting(true);
        try {
            await deleteOperacion(opToDelete.id);
            setMessage({ text: "Operación eliminada correctamente.", type: "success" });
            refresh();
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error(error);
            setMessage({ text: "Error al eliminar la operación.", type: "error" });
        } finally {
            setDeleting(false);
            setOpToDelete(null);
        }
    };

    // EDIT HANDLERS
    const handleEditClick = (op: OperacionResponseDTO) => {
        setEditingOp(op);
        setEditValues({
            cantidad: op.cantidad.toString(),
            precio: op.precioUnitario.toString()
        });
        setEditDialogOpen(true);
    };

    const confirmEdit = async () => {
        if (!editingOp) return;
        setUpdating(true);
        try {
            await updateOperacion(editingOp.id, {
                cantidad: parseFloat(editValues.cantidad),
                precioUnitario: parseFloat(editValues.precio)
            });
            setMessage({ text: "Operación actualizada correctamente.", type: "success" });
            refresh();
            setEditDialogOpen(false);
        } catch (error) {
            console.error(error);
            setMessage({ text: "Error al actualizar la operación.", type: "error" });
        } finally {
            setUpdating(false);
            setEditingOp(null);
        }
    };

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
                                            <TableCell align="center">Acciones</TableCell>
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
                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={1} justifyContent="center">
                                                            <Tooltip title="Editar">
                                                                <IconButton size="small" onClick={() => handleEditClick(op)}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Eliminar">
                                                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(op)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
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

                {/* DELETE CONFIRMATION */}
                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Eliminar Operación"
                    content={`¿Estás seguro de que deseas eliminar esta operación de ${opToDelete?.activoSymbol}? Esta acción no se puede deshacer.`}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={confirmDelete}
                    loading={deleting}
                    confirmText="Eliminar"
                    confirmColor="error"
                />

                {/* EDIT DIALOG */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Editar Operación</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {editingOp?.activoSymbol} - {editingOp?.tipo} ({editingOp?.moneda})
                            </Typography>
                            <TextField
                                label="Cantidad"
                                type="number"
                                fullWidth
                                value={editValues.cantidad}
                                onChange={(e) => setEditValues({ ...editValues, cantidad: e.target.value })}
                            />
                            <TextField
                                label="Precio Unitario"
                                type="number"
                                fullWidth
                                value={editValues.precio}
                                onChange={(e) => setEditValues({ ...editValues, precio: e.target.value })}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setEditDialogOpen(false)} color="inherit">Cancelar</Button>
                        <Button onClick={confirmEdit} variant="contained" disabled={updating}>
                            {updating ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* FEEDBACK */}
                <FloatingMessage
                    open={!!message}
                    message={message?.text || ""}
                    severity={message?.type || "info"}
                    onClose={() => setMessage(null)}
                />
            </Box>
        </RoleGuard >
    );
}
