"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RolUsuario } from "@/types/Usuario";
import { RecomendacionDTO } from "@/types/Recomendacion";
import { getExpertoStats } from "@/services/DashboardService";
import { ExpertoStatsDTO } from "@/types/Dashboard";
import styles from "./styles/Expert.module.css";
import { formatARS, formatPercentage, formatUSD } from "@/utils/format";


import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function ExpertPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<ExpertoStatsDTO | null>(null);

  // Portfolio Data Integration
  const { valuacion, refresh, loading: portfolioLoading } = usePortfolioData();

  React.useEffect(() => {
    refresh(); // Fetch portfolio data
    if (user?.rol === RolUsuario.Experto) {
      getExpertoStats()
        .then(data => {
          setStats(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, refresh]);

  return (
    <RoleGuard allowedRoles={[RolUsuario.Experto]}>
      <Box className={styles.container}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Paper className={styles.headerPaper}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" className={styles.headerTitle}>
                      Panel experto
                    </Typography>
                    <Chip
                      label="Experto"
                      size="small"
                      color="secondary"
                      className={styles.expertChip}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Hola {user?.nombre}, gestioná tus recomendaciones y monitoreá tu portafolio.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/recomendaciones/crear')}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Nueva Recomendación
                  </Button>
                  <Button
                    component={Link}
                    href="/recomendaciones/me"
                    variant="outlined"
                    color="inherit"
                    className={styles.actionButton}
                  >
                    Mis Recomendaciones
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {loading || portfolioLoading ? (
            <>
              {/* Portfolio Summary Skeleton */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper className={styles.summaryCard}>
                  <Typography variant="caption"><Skeleton width="30%" /></Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="rounded" width={50} height={50} />
                        <Box sx={{ width: '100%' }}>
                          <Skeleton width="40%" />
                          <Skeleton width="60%" height={40} />
                          <Skeleton width="30%" />
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="rounded" width={50} height={50} />
                        <Box sx={{ width: '100%' }}>
                          <Skeleton width="40%" />
                          <Skeleton width="60%" height={40} />
                          <Skeleton width="30%" />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Ranking Skeleton */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper className={styles.highlightInfoCard} sx={{ height: '100%' }}>
                  <Typography variant="caption"><Skeleton width="40%" /></Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Skeleton width="50%" height={80} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Skeleton width="80%" />
                  </Box>
                </Paper>
              </Grid>

              {/* Stats Skeleton */}
              <Grid size={{ xs: 12 }}>
                <Paper className={styles.summaryCard}>
                  <Typography variant="caption"><Skeleton width="30%" /></Typography>
                  <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ width: '20%' }}><Skeleton height={60} width="80%" /><Skeleton width="100%" /></Box>
                    <Stack direction="row" spacing={4} sx={{ width: '40%' }}>
                      <Box sx={{ width: '50%' }}><Skeleton width="60%" /><Skeleton height={50} width="80%" /><Skeleton width="100%" /></Box>
                      <Box sx={{ width: '50%' }}><Skeleton width="60%" /><Skeleton height={50} width="80%" /><Skeleton width="100%" /></Box>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </>
          ) : (
            <>
              {/* Portfolio Summary Section */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper className={styles.summaryCard}>
                  <Typography variant="caption" color="text.secondary">
                    Resumen de Portafolio
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
                          <AttachMoneyIcon />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Valor Total</Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {valuacion ? formatARS(valuacion.totalPesos) : "$ -"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {valuacion ? formatUSD(valuacion.totalDolares) : "USD -"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: (valuacion?.gananciaPesos ?? 0) >= 0 ? 'success.light' : 'error.light',
                          color: (valuacion?.gananciaPesos ?? 0) >= 0 ? 'success.dark' : 'error.dark'
                        }}>
                          {(valuacion?.gananciaPesos ?? 0) >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        </Box>
                        <Box>
                          <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography variant="body2" color="text.secondary">Ganancia Total</Typography>
                            <Typography variant="caption" fontWeight="bold" color={(valuacion?.variacionPorcentajePesos ?? 0) >= 0 ? 'success.dark' : 'error.dark'}>
                              ({valuacion ? formatPercentage(valuacion.variacionPorcentajePesos) : "-"}%)
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            color={(valuacion?.gananciaPesos ?? 0) >= 0 ? 'success.main' : 'error.main'}
                          >
                            {valuacion ? formatARS(valuacion.gananciaPesos) : "$ -"}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="baseline">
                            <Typography variant="caption" color="text.secondary">
                              {valuacion ? formatUSD(valuacion.gananciaDolares) : "USD -"}
                            </Typography>
                            <Typography variant="caption" color={(valuacion?.variacionPorcentajeDolares ?? 0) >= 0 ? 'success.main' : 'error.main'}>
                              ({valuacion ? formatPercentage(valuacion.variacionPorcentajeDolares) : "-"}%)
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Ranking Card */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper className={styles.highlightInfoCard} sx={{ height: '100%' }}>
                  <Typography variant="caption" color="text.secondary">
                    Ranking Global
                  </Typography>
                  <Typography
                    variant="h3"
                    className={`${styles.bigNumber} ${styles.neonGreenText}`}
                    sx={{ mt: 2, textAlign: 'center' }}
                  >
                    #{stats?.ranking ?? "-"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Tu posición entre expertos.
                  </Typography>
                </Paper>
              </Grid>

              {/* Recommendations Stats */}
              <Grid size={{ xs: 12 }}>
                <Paper className={styles.summaryCard}>
                  <Typography variant="caption" color="text.secondary">
                    Estadísticas de Recomendaciones
                  </Typography>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                    sx={{ mt: 1.5 }}
                  >
                    <Box>
                      <Typography variant="h4" className={styles.bigNumber}>
                        {stats?.totalRecomendaciones ?? 0}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        recomendaciones totales emitidas.
                      </Typography>
                    </Box>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={4}
                      sx={{ mt: { xs: 2, md: 0 } }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className={styles.subtitleBold}
                        >
                          Activas
                        </Typography>
                        <Typography variant="h5" className={styles.bigNumber}>
                          {stats?.recomendacionesActivas ?? 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          recomendaciones vigentes.
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          className={styles.subtitleBold}
                        >
                          Efectividad
                        </Typography>
                        <Typography variant="h5" className={styles.bigNumber} color="primary">
                          {stats?.efectividad ?? "-"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          tasa de acierto.
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </RoleGuard>
  );
}
