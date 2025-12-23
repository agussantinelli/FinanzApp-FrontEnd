"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Typography
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { getOperacionesByActivo, getOperacionesByPersona } from "@/services/OperacionesService";
import { OperacionResponseDTO } from "@/types/Operacion";
import { formatDateTime, formatQuantity, formatARS, formatUSD } from "@/utils/format";

interface AssetOperationsHistoryProps {
    activoId: number | string;
    symbol: string;
}

export default function AssetOperationsHistory({ activoId, symbol }: AssetOperationsHistoryProps) {
    const { user } = useAuth();
    const [operations, setOperations] = useState<OperacionResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.rol === 'Administrador' || user?.rol === 'Admin';

    useEffect(() => {
        if (!user || !activoId) return;

        setLoading(true);

        const fetchOps = async () => {
            try {
                let data: OperacionResponseDTO[] = [];

                if (isAdmin) {
                    // Admin sees EVERYONE's operations for this asset
                    data = await getOperacionesByActivo(activoId.toString());
                } else {
                    // Regular user sees ONLY their operations for this asset
                    // Fetch all my operations and filter by asset
                    // (Ideally backend should support filtering by both, but this works)
                    const allMyOps = await getOperacionesByPersona(user.id);
                    data = allMyOps.filter(op => op.activoId === Number(activoId));
                }

                // Sort by date desc
                data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                setOperations(data);
            } catch (error) {
                console.error("Error fetching asset operations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOps();
    }, [user, activoId, isAdmin]);

    if (!user) return null;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={30} />
            </Box>
        );
    }

    if (operations.length === 0) {
        return null; // Don't show anything if no operations
    }

    return (
        <Paper elevation={0} sx={{ p: 3, mt: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Historial de Operaciones ({symbol})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {isAdmin
                    ? "Listado completo de operaciones de todos los usuarios para este activo."
                    : "Tus movimientos históricos con este activo."
                }
            </Typography>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Tipo</TableCell>
                            {isAdmin && <TableCell>Usuario</TableCell>}
                            <TableCell align="right">Cantidad</TableCell>
                            <TableCell align="right">Precio</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {operations.map((op) => {
                            const isCompra = op.tipo === "Compra";
                            const isARS = op.moneda === "ARS";
                            const formatMoney = isARS ? formatARS : formatUSD;

                            return (
                                <TableRow key={op.id} hover>
                                    <TableCell>{formatDateTime(op.fecha)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={op.tipo}
                                            size="small"
                                            color={isCompra ? "success" : "error"}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell>
                                            <Typography variant="body2">{op.personaNombre || op.personaApellido ? `${op.personaNombre} ${op.personaApellido}` : 'Usuario'}</Typography>
                                            <Typography variant="caption" color="text.secondary">{op.personaEmail}</Typography>
                                        </TableCell>
                                    )}
                                    <TableCell align="right">{formatQuantity(op.cantidad)}</TableCell>
                                    <TableCell align="right">{formatMoney(op.precioUnitario)}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {formatMoney(op.totalOperado)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
