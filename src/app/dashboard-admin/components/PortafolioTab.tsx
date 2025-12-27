import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    Typography,
    Chip,
    Skeleton,
    IconButton,
    Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAdminPortfolios } from '@/hooks/useAdminPortfolios';
import styles from '../styles/Admin.module.css';

export default function PortafolioTab() {
    const { portfolios, loading, toggleDestacado, deletePortafolio } = useAdminPortfolios();

    if (loading) return <Skeleton variant="rectangular" height={400} />;

    return (
        <Box sx={{ py: 3 }}>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Rentabilidad</TableCell>
                            <TableCell>Destacado</TableCell>
                            <TableCell>Principal</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {portfolios.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>#{row.id.substring(0, 8)}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>{row.nombre}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary" sx={{
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 1,
                                        maxWidth: 200
                                    }}>
                                        {row.descripcion}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${(row.rentabilidadTotal ?? 0) >= 0 ? '+' : ''}${(row.rentabilidadTotal ?? 0).toFixed(2)}%`}
                                        size="small"
                                        color={(row.rentabilidadTotal ?? 0) >= 0 ? 'success' : 'error'}
                                        variant="soft"
                                        className={styles.chip}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => toggleDestacado(row.id, row.esDestacado)}
                                        color={row.esDestacado ? "warning" : "default"}
                                    >
                                        {row.esDestacado ? <StarIcon /> : <StarBorderIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    {row.esPrincipal && <Chip label="Principal" color="info" size="small" />}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Eliminar portafolio">
                                        <IconButton
                                            onClick={() => deletePortafolio(row.id)}
                                            color="error"
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {portfolios.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                        No se encontraron portafolios.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
