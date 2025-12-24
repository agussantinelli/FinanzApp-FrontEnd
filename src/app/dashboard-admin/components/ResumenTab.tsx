import React from 'react';
import { Box, Grid, Paper, Typography, Divider, Skeleton, Stack } from '@mui/material';
import { useAdminStats } from '@/hooks/useAdminStats';
import { UserDTO } from '@/types/Usuario';
import styles from '../styles/Admin.module.css';


import { useAdminUsers } from '@/hooks/useAdminUsers';

export default function ResumenTab() {
    const { params: { stats, portfolioStats, loading } } = useAdminStats(); // Consuming the structure I created
    const { users } = useAdminUsers();

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
                            <Typography className={styles.kpiLabel}>Efectividad Global</Typography>
                            <Typography variant="h4" className={styles.kpiValue}>{stats.efectividadGlobal}</Typography>
                            <Typography variant="body2" color="text.secondary" className={styles.kpiChange}>
                                Total Activos: {stats.totalActivos}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Recent Activity Placeholders */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper className={styles.sectionPaper}>
                            <Typography variant="h6" className={styles.sectionTitle}>Distribución de Usuarios</Typography>
                            <Divider className={styles.divider} />
                            <Typography color="text.secondary" variant="body2">
                                Gráfico de distribución por rol o fecha de registro (Próximamente chart.js)
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper className={styles.sectionPaper}>
                            <Typography variant="h6" className={styles.sectionTitle}>Últimos Registros</Typography>
                            <Divider className={styles.divider} />
                            <Stack spacing={1}>
                                {users.slice(0, 5).map(u => (
                                    <Typography key={u.id} variant="body2">• {u.nombre} ({u.email}) se unió recientemente.</Typography>
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
