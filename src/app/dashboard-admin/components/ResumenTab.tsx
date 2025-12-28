import React, { useMemo } from 'react';
import { Box, Grid, Paper, Typography, Divider, Skeleton, Stack, useTheme } from '@mui/material';
import { useAdminStats } from '@/hooks/useAdminStats';
import { UserDTO } from '@/types/Usuario';
import styles from '../styles/Admin.module.css';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatPercentage } from '@/utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResumenTab() {
    const theme = useTheme();
    const { params: { stats, portfolioStats, loading } } = useAdminStats();
    const { users } = useAdminUsers();

    // Calculate User Distribution
    const userDistribution = useMemo(() => {
        if (!users) return [0, 0, 0];

        let adminCount = 0;
        let expertoCount = 0;
        let inversorCount = 0;

        users.forEach(u => {
            // Role comes as "Admin", "Experto", "Inversor" from enum
            const role = u.rol?.toLowerCase();

            if (role === 'admin' || role === 'administrador') {
                adminCount++;
            } else if (role === 'experto') {
                expertoCount++;
            } else {
                inversorCount++; // Default to inversor
            }
        });

        return [adminCount, expertoCount, inversorCount];
    }, [users]);

    const chartData = {
        labels: ['Administradores', 'Expertos', 'Inversores'],
        datasets: [
            {
                data: userDistribution,
                backgroundColor: [
                    '#FF4081', // Pink for Admin
                    '#7B1FA2', // Purple for Expert
                    '#2196F3', // Blue for Investor
                ],
                borderColor: theme.palette.background.paper,
                borderWidth: 2,
                hoverOffset: 4
            },
        ],
    };

    const chartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: theme.palette.text.primary,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        cutout: '70%',
    };

    if (loading && !stats) {
        return (
            <Grid container spacing={3}>
                {[1, 2, 3, 4].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper className={styles.card}>
                            <Typography variant="caption"><Skeleton width="60%" /></Typography>
                            <Skeleton height={40} width="40%" sx={{ my: 1 }} />
                            <Skeleton width="30%" />
                        </Paper>
                    </Grid>
                ))}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper className={styles.sectionPaper}>
                        <Skeleton variant="rectangular" height={200} />
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    return (
        <Box sx={{ py: 3 }}>
            {stats ? (
                <Grid container spacing={3}>
                    {/* KPI Cards */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper className={styles.card}>
                            <Typography className={styles.kpiLabel}>Total Usuarios</Typography>
                            <Typography variant="h4" className={styles.kpiValue}>{stats.totalUsuarios}</Typography>
                            <Typography variant="body2" color="success.main" className={styles.kpiChange}>
                                +{stats.nuevosUsuariosMes} este mes
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper className={styles.card}>
                            <Typography className={styles.kpiLabel}>Recomendaciones</Typography>
                            <Typography variant="h4" className={styles.kpiValue}>{stats.recomendacionesPendientes}</Typography>
                            <Typography variant="body2" color="warning.main" className={styles.kpiChange}>
                                Pendientes de revisión
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper className={`${styles.card} ${styles.highlightCard}`}>
                            <Typography className={styles.kpiLabel} style={{ color: '#fff' }}>Valor en Custodia</Typography>
                            <Typography variant="h5" className={styles.kpiValue}>${portfolioStats?.valorGlobalPesos?.toLocaleString() ?? '-'}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                                USD {portfolioStats?.valorGlobalDolares?.toLocaleString() ?? '-'}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper className={styles.card}>
                            <Typography className={styles.kpiLabel}>Rendimiento Diario</Typography>
                            <Typography
                                variant="h4"
                                className={styles.kpiValue}
                                sx={{ color: (portfolioStats?.variacionPromedioDiaria ?? 0) >= 0 ? 'success.main' : 'error.main' }}
                            >
                                {(portfolioStats?.variacionPromedioDiaria ?? 0) > 0 ? '+' : ''}
                                {formatPercentage(portfolioStats?.variacionPromedioDiaria)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className={styles.kpiChange}>
                                Promedio global de portafolios
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Chart Section */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper className={styles.sectionPaper} sx={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" className={styles.sectionTitle}>Distribución de Usuarios</Typography>
                            <Divider className={styles.divider} />
                            <Box sx={{ flexGrow: 1, position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                                {users.length > 0 ? (
                                    <Doughnut data={chartData} options={chartOptions} />
                                ) : (
                                    <Skeleton variant="circular" width={200} height={200} />
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper className={styles.sectionPaper} sx={{ height: '350px', overflowY: 'auto' }}>
                            <Typography variant="h6" className={styles.sectionTitle}>Últimos Registros</Typography>
                            <Divider className={styles.divider} />
                            <Stack spacing={1}>
                                {users.slice(0, 10).map(u => (
                                    <Typography key={u.id} variant="body2" sx={{ py: 0.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        • <strong>{u.nombre}</strong> <span style={{ opacity: 0.7 }}>({u.email})</span>
                                        <br />
                                        <span style={{ fontSize: '0.75rem', color: (u.rol === 'Admin' || u.rol === 'Administrador') ? '#FF4081' : u.rol === 'Experto' ? '#7B1FA2' : '#2196F3' }}>
                                            {u.rol}
                                        </span>
                                    </Typography>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <Typography>No se pudieron cargar las estadísticas.</Typography>
            )}
        </Box>
    );
}
