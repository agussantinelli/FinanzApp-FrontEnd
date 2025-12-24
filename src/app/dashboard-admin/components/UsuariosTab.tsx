import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Avatar, Typography, Chip, IconButton, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import styles from '../styles/Admin.module.css';

export default function UsuariosTab() {
    const { users, loading } = useAdminUsers();

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
                            <TableCell align="center">Operaciones</TableCell>
                            <TableCell align="center">Recomendaciones</TableCell>
                            <TableCell align="center">Portafolios</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Fecha Registro</TableCell>
                            <TableCell align="right">Acciones</TableCell>
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
                                <TableCell align="center">
                                    <Typography variant="body2" fontWeight="bold">{row.cantidadOperaciones}</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack alignItems="center">
                                        <Typography variant="body2">{row.cantidadRecomendaciones}</Typography>
                                        {row.cantidadRecomendaciones > 0 && (
                                            <Typography variant="caption" color="success.main" fontSize={10}>
                                                ({row.cantidadRecomendacionesAcertadas} OK)
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body2" fontWeight={row.cantidadPortafoliosDestacados > 0 ? "bold" : "regular"}>
                                        {row.cantidadPortafoliosDestacados}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={row.rol} size="small" color={row.rol === 'Admin' ? 'secondary' : 'default'} variant="outlined" />
                                </TableCell>
                                <TableCell>{new Date(row.fechaAlta).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
