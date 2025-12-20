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
import { formatARS } from "@/utils/format";


export default function ExpertPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<ExpertoStatsDTO | null>(null);

  React.useEffect(() => {
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
  }, [user]);

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
                    Hola {user?.nombre}, acá gestionás tus recomendaciones y
                    análisis para los inversores de FinanzApp.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    component={Link}
                    href="/recomendaciones/me"
                    variant="outlined"
                    color="inherit"
                    size="small"
                    className={styles.actionButton}
                  >
                    Mis Recomendaciones
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper className={styles.summaryCard}>
              <Typography variant="caption" color="text.secondary">
                Resumen de recomendaciones del sistema
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
                    recomendaciones totales emitidas por vos.
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  sx={{ mt: { xs: 2, md: 0 } }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className={styles.subtitleBold}
                    >
                      Activas
                    </Typography>
                    <Typography variant="h6" className={styles.bigNumber}>
                      {stats?.recomendacionesActivas ?? 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      recomendaciones vigentes.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      className={styles.subtitleBold}
                    >
                      Activos cubiertos
                    </Typography>
                    <Typography variant="h6" className={styles.bigNumber}>
                      -
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      activos distintos referidos.
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.infoCard}>
              <Typography variant="caption" color="text.secondary">
                Alcance entre inversores
              </Typography>
              <Typography variant="h4" className={`${styles.bigNumber} ${styles.marginTop}`} sx={{ mt: 0.5 }}>
                -
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                inversores siguen tus recomendaciones.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.highlightInfoCard}>
              <Typography variant="caption" color="text.secondary">
                Ranking Global
              </Typography>
              <Typography
                variant="h4"
                className={`${styles.bigNumber} ${styles.neonGreenText}`}
                sx={{ mt: 0.5 }}
              >
                #{stats?.ranking ?? "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Tu posición entre expertos de la plataforma.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Paper className={styles.roadmapPaper}>
              <Typography variant="h6" className={styles.sectionTitle}>
                Próximos pasos para el módulo de experto
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Acciones rápidas para gestionar tu perfil:
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1.1}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => router.push('/recomendaciones/crear')}
                >
                  Crear Nueva Recomendación
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}
