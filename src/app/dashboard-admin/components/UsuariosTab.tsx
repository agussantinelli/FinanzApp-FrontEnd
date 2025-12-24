import React, { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Avatar, Typography, Chip, IconButton, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import styles from '../styles/Admin.module.css';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function UsuariosTab() {
    const { users, loading, changeRole } = useAdminUsers();

    // Confirm Dialog State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string;
        content: string;
        action: () => Promise<void>;
        color?: "primary" | "error" | "warning" | "success" | "info" | "secondary";
    }>({ title: '', content: '', action: async () => { } });

    const handleOpenConfirm = (title: string, content: string, action: () => Promise<void>, color: "primary" | "error" | "warning" | "success" | "info" | "secondary" = "primary") => {
        setConfirmConfig({ title, content, action, color });
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        setConfirmOpen(false);
        await confirmConfig.action();
    };

    if (loading) return <Skeleton variant="rectangular" height={400} />;

    return (
        <Box sx={{ py: 3 }}>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Operaciones</TableCell>
                            <TableCell>Recomendaciones</TableCell>
                            <TableCell>Portafolios</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Fecha Registro</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>#{row.id.substring(0, 8)}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ width: 24, height: 24 }}>{row.nombre[0]}</Avatar>
                                        <Typography variant="body2" fontWeight={600}>{row.nombre}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{row.cantidadOperaciones}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack alignItems="flex-start">
                                        <Typography variant="body2">{row.cantidadRecomendaciones}</Typography>
                                        {row.cantidadRecomendaciones > 0 && (
                                            <Typography variant="caption" color="success.main" fontSize={10}>
                                                ({row.cantidadRecomendacionesAcertadas} OK)
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2" fontWeight={row.cantidadPortafoliosDestacados > 0 ? "bold" : "regular"}>
                                            {row.cantidadPortafoliosDestacados} Destacados
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {row.cantidadPortafoliosPropios} Propios
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.rol}
                                        size="small"
                                        color={
                                            row.rol.includes('Admin') ? 'error' :
                                                row.rol.includes('Experto') ? 'warning' :
                                                    'info'
                                        }
                                        variant="filled"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell>{new Date(row.fechaAlta).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Stack direction="row">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenConfirm(
                                                "Ascender Usuario",
                                                `¿Estás seguro de ascender a ${row.nombre}?`,
                                                async () => await changeRole(row, 'up'),
                                                "success"
                                            )}
                                            disabled={row.rol === 'Admin'}
                                            title="Ascender"
                                        >
                                            <ArrowUpwardIcon fontSize="small" color={row.rol === 'Admin' ? 'disabled' : 'success'} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenConfirm(
                                                "Descender Usuario",
                                                `¿Estás seguro de descender a ${row.nombre}?`,
                                                async () => await changeRole(row, 'down'),
                                                "warning"
                                            )}
                                            disabled={row.rol === 'Inversor'}
                                            title="Descender"
                                        >
                                            <ArrowDownwardIcon fontSize="small" color={row.rol === 'Inversor' ? 'disabled' : 'warning'} />
                                        </IconButton>
                                        <Box sx={{ mx: 1, borderLeft: '1px solid #444' }} />
                                        {/* Edit/Delete placeholders */}
                                        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmDialog
                open={confirmOpen}
                title={confirmConfig.title}
                content={confirmConfig.content}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                confirmColor={confirmConfig.color}
            />
        </Box>
    );
}
