import React, { useMemo } from 'react';
import { Box, Grid, Paper, Typography, Divider, Skeleton, Stack, useTheme } from '@mui/material';
import { useAdminStats } from '@/hooks/useAdminStats';
import { UserDTO } from '@/types/Usuario';
import styles from '../styles/Admin.module.css';
import { useAdminPortfolios } from '@/hooks/useAdminPortfolios';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { formatPercentage } from '@/utils/format';
import UserDistributionChart from '@/components/charts/UserDistributionChart';

export default function ResumenTab() {
    const theme = useTheme();
    const { params: { stats, portfolioStats, loading: statsLoading } } = useAdminStats();
    const { users } = useAdminUsers();
    const { portfolios, loading: portfoliosLoading } = useAdminPortfolios(); // Fetch portfolios

    const averageReturn = useMemo(() => {
        if (!portfolios || portfolios.length === 0) return 0;

        let totalInvested = 0;
        let totalValued = 0;

        portfolios.forEach(p => {
            const invested = p.totalInvertidoUSD || 0;
            const valued = p.totalValuadoUSD || 0;

            if (invested > 0) {
                totalInvested += invested;
                totalValued += valued;
            }
        });

        return totalInvested > 0 ? ((totalValued - totalInvested) / totalInvested) * 100 : 0;
    }, [portfolios]);

    const loading = statsLoading || portfoliosLoading;

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
                            <Typography className={styles.kpiLabel}>Rendimiento Promedio</Typography>
                            <Typography
                                variant="h4"
                                className={styles.kpiValue}
                                sx={{ color: averageReturn >= 0 ? 'success.main' : 'error.main' }}
                            >
                                {averageReturn > 0 ? '+' : ''}
                                {formatPercentage(averageReturn)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className={styles.kpiChange}>
                                Rendimiento global ponderado
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper className={styles.sectionPaper} sx={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" className={styles.sectionTitle}>Distribución de Usuarios</Typography>
                            <Divider className={styles.divider} />

                            <UserDistributionChart users={users} />

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
