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
import { getCurrentUser } from "@/services/AuthService";
import { AuthenticatedUser } from "@/types/Usuario";

import styles from "./styles/Expert.module.css";

export default function ExpertDashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthenticatedUser | null>(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/auth/login");
      return;
    }

    if (u.rol !== "Experto") {
      router.replace("/access-denied");
      return;
    }

    setUser(u);
    setChecking(false);
  }, [router]);

  if (checking || !user) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography variant="body1" color="text.secondary">
          Cargando panel de experto...
        </Typography>
      </Box>
    );
  }

  // Datos demo / hardcodeados por ahora
  const totalRecomendaciones = 86;
  const recomendacionesHoy = 12;
  const activosEnRecomendaciones = 34;

  const inversoresSiguiendo = 27;
  const listasSeguimiento = 9;

  const tasaAcierto = 68; // %
  const horizontePromedio = 45; // días

  return (
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
                  Hola {user.nombre}, acá gestionás tus recomendaciones y
                  análisis para los inversores de FinanzApp.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  component={Link}
                  href="/portfolio"
                  variant="outlined"
                  color="inherit"
                  size="small"
                  className={styles.actionButton}
                >
                  Ver mi portafolio
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
                  {totalRecomendaciones}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  recomendaciones activas emitidas por vos.
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
                    Hoy
                  </Typography>
                  <Typography variant="h6" className={styles.bigNumber}>
                    {recomendacionesHoy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    nuevas recomendaciones generadas.
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
                    {activosEnRecomendaciones}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    activos distintos referidos en tus recomendaciones.
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
              {inversoresSiguiendo}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              inversores siguen al menos una de tus recomendaciones.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Más adelante podés vincular esto con las cuentas reales y
              posiciones.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className={styles.infoCard}>
            <Typography variant="caption" color="text.secondary">
              Listas y carteras modelo
            </Typography>
            <Typography variant="h4" className={`${styles.bigNumber} ${styles.marginTop}`} sx={{ mt: 0.5 }}>
              {listasSeguimiento}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              listas de seguimiento o carteras modelo asociadas a tus ideas.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Podés usar esto para armar paquetes de recomendaciones
              “conservador / moderado / agresivo”.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className={styles.highlightInfoCard}>
            <Typography variant="caption" color="text.secondary">
              Desempeño estimado
            </Typography>
            <Typography
              variant="h4"
              className={`${styles.bigNumber} ${styles.neonGreenText}`}
              sx={{ mt: 0.5 }}
            >
              {tasaAcierto}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              tasa de acierto de tus recomendaciones (demo). Después podés
              calcularlo con precios históricos de los activos.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className={styles.infoCard}>
            <Typography variant="caption" color="text.secondary">
              Horizonte de inversión
            </Typography>
            <Typography variant="h4" className={`${styles.bigNumber} ${styles.marginTop}`} sx={{ mt: 0.5 }}>
              {horizontePromedio} días
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              horizonte promedio sugerido en tus ideas (corto / mediano plazo).
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Podrías segmentar recomendaciones por plazo y nivel de riesgo.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper className={styles.roadmapPaper}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Próximos pasos para el módulo de experto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Algunas ideas de funcionalidades que podrías implementar más
              adelante:
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={1.1}>
              <Typography variant="body2">
                • Crear y editar recomendaciones con target de precio, stop loss
                y horizonte temporal.
              </Typography>
              <Typography variant="body2">
                • Asociar cada recomendación a un conjunto de activos (por
                ejemplo, CEDEAR + dólar de referencia).
              </Typography>
              <Typography variant="body2">
                • Mostrar a los inversores qué recomendaciones nuevas se
                publicaron desde su último ingreso.
              </Typography>
              <Typography variant="body2">
                • Armar métricas de performance históricas por experto
                (rentabilidad, drawdown, volatilidad).
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
