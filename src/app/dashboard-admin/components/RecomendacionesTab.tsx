import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, IconButton, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { EstadoRecomendacion } from '@/types/Recomendacion';
import { useAdminRecommendations } from '@/hooks/useAdminRecommendations';
import styles from '../styles/Admin.module.css';

export default function RecomendacionesTab() {
    const {
        recommendations,
        loading,
        filter,
        setFilter,
        toggleDestacar,
        resolver
    } = useAdminRecommendations();

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Gestión de Recomendaciones</Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={filter} label="Estado" onChange={(e) => setFilter(e.target.value as any)}>
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value={EstadoRecomendacion.Pendiente}>Pendientes</MenuItem>
                        <MenuItem value={EstadoRecomendacion.Aceptada}>Aceptadas</MenuItem>
                        <MenuItem value={EstadoRecomendacion.Rechazada}>Rechazadas</MenuItem>
                        <MenuItem value={EstadoRecomendacion.Cerrada}>Cerradas</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table>
                        <TableHead className={styles.tableHead}>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Autor</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell align="center">Destacada</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recommendations.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{row.titulo}</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(row.fecha).toLocaleDateString()}</Typography>
                                    </TableCell>
                                    <TableCell>{row.autorNombre}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={EstadoRecomendacion[row.estado]}
                                            size="small"
                                            color={row.estado === EstadoRecomendacion.Aceptada ? "success" : row.estado === EstadoRecomendacion.Pendiente ? "warning" : "default"}
                                            variant="outlined"
                                        />
                                        {row.esAcertada !== undefined && row.esAcertada !== null && (
                                            <Chip
                                                icon={row.esAcertada ? <CheckIcon /> : <CloseIcon />}
                                                label={row.esAcertada ? "Acertada" : "Fallida"}
                                                size="small"
                                                sx={{ ml: 1 }}
                                                color={row.esAcertada ? "success" : "error"}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => toggleDestacar(row.id)} color={row.esDestacada ? "warning" : "default"}>
                                            {row.esDestacada ? <StarIcon /> : <StarBorderIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.estado !== EstadoRecomendacion.Cerrada && (
                                            <>
                                                <IconButton size="small" title="Marcar Acertada" onClick={() => resolver(row.id, true)} color="success"><CheckIcon /></IconButton>
                                                <IconButton size="small" title="Marcar Fallida" onClick={() => resolver(row.id, false)} color="error"><CloseIcon /></IconButton>
                                            </>
                                        )}

                                    </TableCell>
                                </TableRow>
                            ))}
                            {recommendations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No hay recomendaciones con este filtro.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
