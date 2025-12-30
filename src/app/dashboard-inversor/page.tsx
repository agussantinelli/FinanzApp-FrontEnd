"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RolUsuario } from "@/types/Usuario";
import { getInversorStats, getExpertoStats, getAdminStats, getAdminPortfolioStats } from "@/services/DashboardService";
import { InversorStatsDTO, ExpertoStatsDTO } from "@/types/Dashboard";
import { AdminStatsDTO, AdminPortfolioStatsDTO } from "@/types/Admin";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { formatARS, formatPercentage, formatUSD } from "@/utils/format";
import styles from "./styles/Dashboard.module.css";

import { CurrencyToggle } from "@/components/common/CurrencyToggle";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [inversorStats, setInversorStats] = useState<InversorStatsDTO | null>(null);
  const [expertoStats, setExpertoStats] = useState<ExpertoStatsDTO | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStatsDTO | null>(null);
  const [adminPortfolioStats, setAdminPortfolioStats] = useState<AdminPortfolioStatsDTO | null>(null);
  const [loading, setLoading] = useState(false);


  const [currency, setCurrency] = React.useState<'ARS' | 'USD'>('USD');

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        if (user.rol === RolUsuario.Inversor) {
          const data = await getInversorStats();
          setInversorStats(data);
        } else if (user.rol === RolUsuario.Experto) {
          const data = await getExpertoStats();
          setExpertoStats(data);
        } else if (user.rol === RolUsuario.Admin) {
          const [stats, pStats] = await Promise.all([
            getAdminStats(),
            getAdminPortfolioStats()
          ]);
          setAdminStats(stats);
          setAdminPortfolioStats(pStats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);


  const { valuacion, loading: portfolioLoading } = usePortfolioData();

  const renderInversorDashboard = () => {

    let cryptoExposure = inversorStats?.exposicionCripto ?? 0;
    if (valuacion?.activos) {
      const cryptoVal = valuacion.activos
        .filter(a => a.tipoActivo === 'Criptomoneda' || a.tipoActivo === 'Cripto' || a.moneda === 'USDT' || a.moneda === 'USDC')
        .reduce((acc: number, a: any) => acc + a.porcentajeCartera, 0);
      cryptoExposure = cryptoVal;
    }


    const totalValue = valuacion
      ? (currency === 'ARS' ? valuacion.totalPesos : valuacion.totalDolares)
      : (inversorStats?.valorTotal ?? 0); // Fallback to stats if hook not ready (stats are likely ARS, need caution)

    // Note: inversorStats.valorTotal is usually in ARS or default. 
    // Ideally we rely on valuacion for currency switching.
    // If currency is USD but we use inversorStats (ARS), it's wrong.
    // So prefer valuacion always if available.

    let dailyGain = valuacion
      ? (currency === 'ARS' ? valuacion.gananciaPesos : valuacion.gananciaDolares)
      : 0;

    let dailyChangePct = valuacion
      ? (currency === 'ARS' ? valuacion.variacionPorcentajePesos : valuacion.variacionPorcentajeDolares)
      : (inversorStats?.rendimientoDiario ?? 0);


    if (valuacion && currency === 'USD' && dailyGain === 0 && valuacion.gananciaPesos !== 0 && valuacion.totalDolares > 0) {
      const impliedRate = valuacion.totalPesos / valuacion.totalDolares;
      if (impliedRate > 0) {
        dailyGain = valuacion.gananciaPesos / impliedRate;

        // Recalculate percentage based on this estimated gain
        const cost = totalValue - dailyGain;
        if (cost !== 0) {
          dailyChangePct = (dailyGain / cost) * 100;
        }
      }
    }

    const formatFn = currency === 'ARS' ? formatARS : formatUSD;

    return (
      <>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={`${styles.card} ${styles.highlightCard}`}>
            <Typography variant="caption" color="text.secondary">
              Valor estimado ({currency})
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              {valuacion ? formatFn(totalValue) : (currency === 'ARS' && inversorStats?.valorTotal ? `$ ${inversorStats.valorTotal.toLocaleString()}` : "-")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Posiciones en CEDEARs, acciones y cripto.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Resultado ({currency})
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                variant="h5"
                className={`${styles.cardValue} ${(dailyChangePct ?? 0) >= 0 ? styles.positiveChange : styles.negativeChange}`}
                sx={{ color: (dailyChangePct ?? 0) >= 0 ? 'success.main' : 'error.main' }}
              >
                {formatPercentage(dailyChangePct ?? 0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({formatFn(dailyGain)})
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Variación total de tu cartera.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Cantidad de activos
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              {valuacion?.activos ? valuacion.activos.length : (inversorStats?.cantidadActivos ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Instrumentos distintos en cartera.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Exposición en cripto
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              {formatPercentage(cryptoExposure)} %
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Porcentaje de portafolio.
            </Typography>
          </Paper>
        </Grid>
      </>
    );
  };

  const renderExpertoDashboard = () => (
    <>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper className={`${styles.card} ${styles.highlightCard}`}>
          <Typography variant="caption" color="text.secondary">
            Total Recomendaciones
          </Typography>
          <Typography variant="h4" className={styles.cardValue}>
            {expertoStats?.totalRecomendaciones ?? 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Histórico de recomendaciones realizadas.
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">
            Activas
          </Typography>
          <Typography variant="h4" className={styles.cardValue}>
            {expertoStats?.recomendacionesActivas ?? 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recomendaciones vigentes actualmente.
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">
            Ranking Global
          </Typography>
          <Typography variant="h4" className={`${styles.cardValue} ${styles.neonGreenText}`}>
            #{expertoStats?.ranking ?? "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tu posición entre expertos.
          </Typography>
        </Paper>
      </Grid>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">Total Usuarios</Typography>
          <Typography variant="h5" className={styles.cardValue}>{adminStats?.totalUsuarios ?? 0}</Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">Nuevos (Mes)</Typography>
          <Typography variant="h5" className={styles.cardValue} color="success.main">+{adminStats?.nuevosUsuariosMes ?? 0}</Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">Total Activos</Typography>
          <Typography variant="h5" className={styles.cardValue}>{adminStats?.totalActivos ?? 0}</Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">Pendientes Rev.</Typography>
          <Typography variant="h5" className={styles.cardValue} color="warning.main">{adminStats?.recomendacionesPendientes ?? 0}</Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper className={`${styles.card} ${styles.highlightCard}`}>
          <Typography variant="caption" color="text.secondary">Capital Bajo Gestión ({currency})</Typography>
          <Typography variant="h4" className={styles.cardValue} sx={{ mt: 1 }}>
            {currency === 'ARS'
              ? `$ ${adminPortfolioStats?.valorGlobalPesos?.toLocaleString("es-AR") ?? "-"}`
              : `USD ${adminPortfolioStats?.valorGlobalDolares?.toLocaleString("es-AR") ?? "-"}`
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currency === 'ARS'
              ? `Equivalente a USD ${adminPortfolioStats?.valorGlobalDolares?.toLocaleString("es-AR") ?? "-"}`
              : `Equivalente a ARS ${adminPortfolioStats?.valorGlobalPesos?.toLocaleString("es-AR") ?? "-"}`
            }
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">Activo Más Popular</Typography>
          {adminPortfolioStats?.activosMasPopulares && adminPortfolioStats.activosMasPopulares.length > 0 ? (
            <>
              <Typography variant="h4" className={styles.cardValue} sx={{ mt: 1 }}>
                {adminPortfolioStats.activosMasPopulares[0].symbol}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En cartera de {adminPortfolioStats.activosMasPopulares[0].cantidadInversores} usuarios.
              </Typography>
            </>
          ) : (
            <Typography variant="h5" className={styles.cardValue}>-</Typography>
          )}
        </Paper>
      </Grid>
    </>
  );

  return (
    <RoleGuard allowedRoles={[RolUsuario.Inversor, RolUsuario.Experto, RolUsuario.Admin]}>
      <Box className={styles.container}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Paper
              className={styles.headerPaper}
              sx={{
                border: user?.rol === RolUsuario.Admin ? '1px solid #FF4081' :
                  user?.rol === RolUsuario.Experto ? '1px solid #7B1FA2' :
                    '1px solid #2196F3',
                boxShadow: user?.rol === RolUsuario.Admin ? '0 0 15px rgba(255, 64, 129, 0.2)' :
                  user?.rol === RolUsuario.Experto ? '0 0 15px rgba(123, 31, 162, 0.2)' :
                    '0 0 15px rgba(33, 150, 243, 0.2)'
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {user && (
                      <Typography variant="h4" className={styles.headerTitle}>
                        Hola, {user.nombre} 👋
                      </Typography>
                    )}
                    <Chip
                      label={user?.rol || "Usuario"}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 'bold',
                        color: user?.rol === RolUsuario.Admin ? '#FF4081' :
                          user?.rol === RolUsuario.Experto ? '#7B1FA2' :
                            '#2196F3',
                        borderColor: user?.rol === RolUsuario.Admin ? '#FF4081' :
                          user?.rol === RolUsuario.Experto ? '#7B1FA2' :
                            '#2196F3',
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Bienvenido a tu panel de FinanzApp.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center">

                  <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />

                  <Button
                    component={Link}
                    href="/perfil"
                    variant="outlined"
                    color="inherit"
                    size="small"
                    className={styles.actionButton}
                  >
                    Ver perfil
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {loading || portfolioLoading ? (

            <>
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper className={`${styles.card} ${styles.highlightCard}`}>
                  <Typography variant="caption"><Skeleton width="60%" /></Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}><Skeleton width="80%" /></Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}><Skeleton width="100%" /></Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper className={styles.card}>
                  <Typography variant="caption"><Skeleton width="60%" /></Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}><Skeleton width="50%" /></Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}><Skeleton width="90%" /></Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper className={styles.card}>
                  <Typography variant="caption"><Skeleton width="60%" /></Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}><Skeleton width="30%" /></Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}><Skeleton width="70%" /></Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper className={styles.card}>
                  <Typography variant="caption"><Skeleton width="60%" /></Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}><Skeleton width="40%" /></Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}><Skeleton width="80%" /></Typography>
                </Paper>
              </Grid>
            </>
          ) : (
            <>
              {user?.rol === RolUsuario.Inversor && renderInversorDashboard()}
              {user?.rol === RolUsuario.Experto && renderExpertoDashboard()}
              {user?.rol === RolUsuario.Admin && renderAdminDashboard()}
            </>
          )}




          {user?.rol === RolUsuario.Inversor && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6" className={styles.sectionTitle}>
                  Atajos rápidos
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Mi Portafolio</Typography>
                      <Typography variant="body2" color="text.secondary">Ver rendimiento y activos.</Typography>
                    </Box>
                    <Button component={Link} href="/portfolio" size="small" variant="outlined" className={styles.actionButton}>Ir</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Mis Operaciones</Typography>
                      <Typography variant="body2" color="text.secondary">Historial de operaciones.</Typography>
                    </Box>
                    <Button component={Link} href="/operaciones/me" size="small" variant="outlined" className={styles.actionButton}>Ver</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Mercado</Typography>
                      <Typography variant="body2" color="text.secondary">Explorar activos.</Typography>
                    </Box>
                    <Button component={Link} href="/activos" size="small" variant="outlined" className={styles.actionButton}>Explorar</Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          )}


          {user?.rol === RolUsuario.Experto && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6" className={styles.sectionTitle}>
                  Gestión Rápida
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Nueva Recomendación</Typography>
                      <Typography variant="body2" color="text.secondary">Publicar análisis.</Typography>
                    </Box>
                    <Button component={Link} href="/recomendaciones/realizar" size="small" variant="contained" className={styles.actionButton}>Crear</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Mis Recomendaciones</Typography>
                      <Typography variant="body2" color="text.secondary">Gestionar activas.</Typography>
                    </Box>
                    <Button component={Link} href="/recomendaciones/me" size="small" variant="outlined" className={styles.actionButton}>Ver</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Noticias</Typography>
                      <Typography variant="body2" color="text.secondary">Actualidad financiera.</Typography>
                    </Box>
                    <Button component={Link} href="/noticias" size="small" variant="outlined" className={styles.actionButton}>Leer</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Mis Operaciones</Typography>
                      <Typography variant="body2" color="text.secondary">Historial de operaciones.</Typography>
                    </Box>
                    <Button component={Link} href="/operaciones/me" size="small" variant="outlined" className={styles.actionButton}>Ver</Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          )}


          {user?.rol === RolUsuario.Admin && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6" className={styles.sectionTitle}>
                  Atajos de Administración
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Panel Admin</Typography>
                      <Typography variant="body2" color="text.secondary">Usuarios y operaciones.</Typography>
                    </Box>
                    <Button component={Link} href="/dashboard-admin" size="small" variant="outlined" className={styles.actionButton}>Panel</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Reportes</Typography>
                      <Typography variant="body2" color="text.secondary">Métricas del sistema.</Typography>
                    </Box>
                    <Button component={Link} href="/reportes" size="small" variant="outlined" className={styles.actionButton}>Ver</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Recomendaciones</Typography>
                      <Typography variant="body2" color="text.secondary">Supervisar contenido.</Typography>
                    </Box>
                    <Button component={Link} href="/recomendaciones" size="small" variant="outlined" className={styles.actionButton}>Ir</Button>
                  </Stack>
                  <Divider flexItem className={styles.divider} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" className={styles.subtitle}>Mis Operaciones</Typography>
                      <Typography variant="body2" color="text.secondary">Historial personal.</Typography>
                    </Box>
                    <Button component={Link} href="/operaciones/me" size="small" variant="outlined" className={styles.actionButton}>Ver</Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          )}

        </Grid>
      </Box>
    </RoleGuard>
  );
}
