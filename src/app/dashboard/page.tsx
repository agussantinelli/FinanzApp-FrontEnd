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
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { RolUsuario } from "@/types/Usuario";
import { getInversorStats, getExpertoStats, getAdminStats, getAdminPortfolioStats } from "@/services/DashboardService";
import { InversorStatsDTO, ExpertoStatsDTO, AdminStatsDTO, AdminPortfolioStatsDTO } from "@/types/Dashboard";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { formatARS, formatPercentage, formatUSD } from "@/utils/format";
import styles from "./styles/Dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [inversorStats, setInversorStats] = useState<InversorStatsDTO | null>(null);
  const [expertoStats, setExpertoStats] = useState<ExpertoStatsDTO | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStatsDTO | null>(null);
  const [adminPortfolioStats, setAdminPortfolioStats] = useState<AdminPortfolioStatsDTO | null>(null);
  const [loading, setLoading] = useState(false);

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
        // 401 errors are handled by http interceptor
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  /* Hook Integration */
  const { valuacion } = usePortfolioData();

  const renderInversorDashboard = () => {
    // Calculate crypto exposure manually from fresh data if available, else fallback to stats
    let cryptoExposure = inversorStats?.exposicionCripto ?? 0;
    if (valuacion?.activos) {
      const totalVal = valuacion.totalDolares || 1; // avoid div 0
      const cryptoVal = valuacion.activos
        .filter(a => a.tipoActivo === 'Criptomoneda' || a.tipoActivo === 'Cripto' || a.moneda === 'USDT' || a.moneda === 'USDC')
        .reduce((acc: number, a: any) => {
          // Approximation: if asset is USD based, use its value directly as USD part
          // But we need consistent valuation. 
          // Better: use porcentajeCartera sum if reliable, or just use stats.
          return acc + a.porcentajeCartera;
        }, 0);
      cryptoExposure = cryptoVal;
    }

    return (
      <>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={`${styles.card} ${styles.highlightCard}`}>
            <Typography variant="caption" color="text.secondary">
              Valor estimado (USD)
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              {valuacion ? formatUSD(valuacion.totalDolares) : (inversorStats?.valorTotal ? `$ ${inversorStats.valorTotal}` : "-")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {valuacion ? formatARS(valuacion.totalPesos) : "ARS -"}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Resultado diario (USD)
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography
                variant="h5"
                className={`${styles.cardValue} ${(valuacion?.variacionPorcentajeDolares ?? 0) >= 0 ? styles.positiveChange : styles.negativeChange}`}
                sx={{ color: (valuacion?.variacionPorcentajeDolares ?? 0) >= 0 ? 'success.main' : 'error.main' }}
              >
                {valuacion ? formatPercentage(valuacion.variacionPorcentajeDolares) : "-"}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({valuacion ? formatUSD(valuacion.gananciaDolares) : "-"})
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Variación en moneda dura.
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
          <Typography variant="caption" color="text.secondary">Capital Bajo Gestión (ARS)</Typography>
          <Typography variant="h4" className={styles.cardValue} sx={{ mt: 1 }}>
            $ {adminPortfolioStats?.totalCapitalPesos?.toLocaleString("es-AR") ?? "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Equivalente a USD {adminPortfolioStats?.totalCapitalDolares?.toLocaleString("es-AR") ?? "-"}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">Activo Más Popular</Typography>
          {adminPortfolioStats?.activosMasPopulares && adminPortfolioStats.activosMasPopulares.length > 0 ? (
            <>
              <Typography variant="h4" className={styles.cardValue} sx={{ mt: 1 }}>
                {adminPortfolioStats.activosMasPopulares[0].activoSymbol}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En cartera de {adminPortfolioStats.activosMasPopulares[0].cantidadUsuarios} usuarios.
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
            <Paper className={styles.headerPaper}>
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
                      color={user?.rol === RolUsuario.Admin ? "secondary" : "primary"}
                      className={styles.roleChip}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Bienvenido a tu panel de FinanzApp.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5}>
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

          {loading && (
            <Grid size={{ xs: 12 }} display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Grid>
          )}

          {!loading && user?.rol === RolUsuario.Inversor && renderInversorDashboard()}
          {!loading && user?.rol === RolUsuario.Experto && renderExpertoDashboard()}
          {!loading && user?.rol === RolUsuario.Admin && renderAdminDashboard()}

          {/* Inversor Shortcuts */}
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
                      <Typography variant="subtitle2" className={styles.subtitle}>Mis Movimientos</Typography>
                      <Typography variant="body2" color="text.secondary">Historial de operaciones.</Typography>
                    </Box>
                    <Button component={Link} href="/movimientos" size="small" variant="outlined" className={styles.actionButton}>Ver</Button>
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

          {/* Experto Shortcuts */}
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
                </Stack>
              </Paper>
            </Grid>
          )}

          {/* Admin Shortcuts */}
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
                    <Button component={Link} href="/admin" size="small" variant="outlined" className={styles.actionButton}>Panel</Button>
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
                </Stack>
              </Paper>
            </Grid>
          )}

        </Grid>
      </Box>
    </RoleGuard>
  );
}
