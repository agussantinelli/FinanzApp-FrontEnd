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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAdminPortfolios } from '@/hooks/useAdminPortfolios';
import styles from '../styles/Admin.module.css';
import { useRouter } from 'next/navigation';

import { CurrencyToggle } from "@/components/common/CurrencyToggle";
import { formatARS, formatUSD } from "@/utils/format";

export default function PortafolioTab() {
    const { portfolios, loading, toggleDestacado, deletePortafolio } = useAdminPortfolios();
    const router = useRouter();
    const [currency, setCurrency] = React.useState<'ARS' | 'USD'>('USD');

    if (loading) return <Skeleton variant="rectangular" height={400} />;

    return (
        <Box sx={{ py: 3 }}>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />
            </Stack>

            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead className={styles.tableHead}>
                        <TableRow>
                            <TableCell>Creador</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Nombre Portafolio</TableCell>
                            <TableCell>Rentabilidad ({currency})</TableCell>
                            <TableCell>Destacado</TableCell>
                            <TableCell>Principal</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {portfolios.map((row) => {
                            const isARS = currency === 'ARS';

                            // Select values based on currency
                            const totalInvertido = isARS ? (row.totalInvertidoARS ?? 0) : (row.totalInvertidoUSD ?? 0);
                            const totalValuado = isARS ? (row.totalValuadoARS ?? 0) : (row.totalValuadoUSD ?? 0);

                            // Select pre-calculated variation if available
                            const preCalculatedVar = isARS ? row.variacionPorcentajePesos : row.variacionPorcentajeDolares;

                            // Default to pre-calculated, else calculate naive ROI
                            let rentabilidad = preCalculatedVar ?? 0;

                            if (preCalculatedVar === undefined && totalInvertido > 0) {
                                rentabilidad = ((totalValuado - totalInvertido) / totalInvertido) * 100;
                            }

                            return (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {row.nombreUsuario || 'Desconocido'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.rolUsuario || 'N/A'}
                                            size="small"
                                            variant="outlined"
                                            color={row.rolUsuario === 'Experto' ? 'secondary' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack>
                                            <Typography variant="body2" fontWeight={500}>{row.nombre}</Typography>
                                            {row.descripcion && (
                                                <Typography variant="caption" color="text.secondary" sx={{
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 1,
                                                    maxWidth: 200
                                                }}>
                                                    {row.descripcion}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={`Inv: ${isARS ? formatARS(totalInvertido) : formatUSD(totalInvertido)} | Val: ${isARS ? formatARS(totalValuado) : formatUSD(totalValuado)}`} arrow>
                                            <Chip
                                                label={`${rentabilidad >= 0 ? '+' : ''}${rentabilidad.toFixed(2)}%`}
                                                size="small"
                                                color={rentabilidad >= 0 ? 'success' : 'error'}
                                                variant="filled"
                                                className={styles.chip}
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Tooltip>
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
                                        <Tooltip title="Ver Detalle">
                                            <IconButton
                                                onClick={() => router.push(`/dashboard-admin/portfolio/${row.id}`)}
                                                color="primary"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
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
                            );
                        })}
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
        </Box >
    );
}
