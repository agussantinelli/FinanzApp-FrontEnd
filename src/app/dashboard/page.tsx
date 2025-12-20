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
import {
  getInversorStats, getExpertoStats, getAdminStats,
  InversorStatsDTO, ExpertoStatsDTO, AdminStatsDTO
} from "@/services/DashboardService";

import styles from "./styles/Dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [inversorStats, setInversorStats] = useState<InversorStatsDTO | null>(null);
  const [expertoStats, setExpertoStats] = useState<ExpertoStatsDTO | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStatsDTO | null>(null);
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
          const data = await getAdminStats();
          setAdminStats(data);
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

  const renderInversorDashboard = () => (
    <>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper className={`${styles.card} ${styles.highlightCard}`}>
          <Typography variant="caption" color="text.secondary">
            Valor estimado del portafolio
          </Typography>
          <Typography variant="h5" className={styles.cardValue}>
            $ {inversorStats?.valorTotal?.toLocaleString() ?? "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Posiciones en CEDEARs, acciones y cripto.
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">
            Resultado diario (P&L)
          </Typography>
          <Typography
            variant="h5"
            className={`${styles.cardValue} ${styles.neonGreenText}`}
          >
            {inversorStats?.rendimientoDiario != null ? `${inversorStats.rendimientoDiario} %` : "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Variación diaria de tu cartera.
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Paper className={styles.card}>
          <Typography variant="caption" color="text.secondary">
            Cantidad de activos
          </Typography>
          <Typography variant="h5" className={styles.cardValue}>
            {inversorStats?.cantidadActivos ?? 0}
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
            {inversorStats?.exposicionCripto ?? 0} %
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Porcentaje de portafolio en criptomonedas.
          </Typography>
        </Paper>
      </Grid>
    </>
  );

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
            Tasa de Acierto (Est.)
          </Typography>
          <Typography variant="h4" className={`${styles.cardValue} ${styles.neonGreenText}`}>
            {expertoStats?.tasaAcierto != null ? `${expertoStats.tasaAcierto}%` : "N/A"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rendimiento estimado de tus calls.
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

          {/* Common Shortcuts Section (Always visible or conditional?) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.sectionPaper}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Atajos rápidos
              </Typography>
              <Stack spacing={1.2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" className={styles.subtitle}>Mercado</Typography>
                    <Typography variant="body2" color="text.secondary">Cotizaciones en tiempo real.</Typography>
                  </Box>
                  <Button component={Link} href="/cedears" size="small" variant="outlined" className={styles.actionButton}>CEDEARs</Button>
                </Stack>
                <Divider flexItem className={styles.divider} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" className={styles.subtitle}>Criptomonedas</Typography>
                  </Box>
                  <Button component={Link} href="/crypto" size="small" variant="outlined" className={styles.actionButton}>Ver</Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Expert Specific Actions? */}
          {user?.rol === RolUsuario.Experto && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.sectionPaper}>
                <Typography variant="h6" className={styles.sectionTitle}>Gestión</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => router.push('/recomendaciones/crear')}
                >
                  Nueva Recomendación
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => router.push('/recomendaciones/me')}
                >
                  Mis Recomendaciones
                </Button>
              </Paper>
            </Grid>
          )}

        </Grid>
      </Box>
    </RoleGuard>
  );
}
