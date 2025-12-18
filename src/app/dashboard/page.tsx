"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  type AuthUser,
} from "@/services/AuthService";

import styles from "./styles/Dashboard.module.css";



export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/auth/login");
      return;
    }

    if (u.rol !== "Inversor") {
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
          Cargando tu panel de inversor...
        </Typography>
      </Box>
    );
  }

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
                    Hola, {user.nombre} 👋
                  </Typography>
                  <Chip
                    label={user.rol === "Admin" ? "Admin" : "Inversor"}
                    size="small"
                    color={user.rol === "Admin" ? "secondary" : "primary"}
                    className={styles.roleChip}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Bienvenido a tu panel de FinanzApp. Acá vas a ver un resumen
                  general y accesos rápidos a las secciones principales.
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

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={`${styles.card} ${styles.highlightCard}`}>
            <Typography variant="caption" color="text.secondary">
              Valor estimado del portafolio
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              $ 0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              En la próxima iteración podés sumar la suma de tus posiciones en
              CEDEARs, acciones y cripto.
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
              + 0,00 %
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Acá podrías calcular variación diaria de tu cartera a partir de
              las últimas cotizaciones.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Cantidad de activos
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Número de instrumentos distintos en los que invertís (CEDEARs,
              acciones, bonos, cripto, etc.).
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Exposición en cripto
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              0 %
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Más adelante podés calcular qué porcentaje de tu portafolio está
              en criptomonedas.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className={styles.sectionPaper}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Atajos rápidos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Entrá directo a las secciones que más vas a usar para el análisis
              diario.
            </Typography>

            <Stack spacing={1.2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle2" className={styles.subtitle}>
                    Cotizaciones de dólar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MEP, CCL, oficial, tarjeta. Todo en un mismo panel.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href="/dolar"
                  size="small"
                  variant="outlined"
                  className={styles.actionButton}
                >
                  Ver
                </Button>
              </Stack>

              <Divider flexItem className={styles.divider} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle2" className={styles.subtitle}>
                    CEDEARs & acciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compará precios locales vs. USA y CCL implícito.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href="/cedears"
                  size="small"
                  variant="outlined"
                  className={styles.actionButton}
                >
                  Ver
                </Button>
              </Stack>

              <Divider flexItem className={styles.divider} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle2" className={styles.subtitle}>
                    Criptomonedas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seguimiento del top de mercado y precios en ARS.
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href="/crypto"
                  size="small"
                  variant="outlined"
                  className={styles.actionButton}
                >
                  Ver
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className={styles.sectionPaper}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Próximos pasos en FinanzApp
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ideas de cosas que podés ir sumando para enriquecer el TP:
            </Typography>

            <Stack spacing={1.2}>
              <Typography variant="body2">
                • Guardar operaciones reales en la base y calcular posición por
                activo.
              </Typography>
              <Typography variant="body2">
                • Generar un reporte PDF con el detalle del portafolio.
              </Typography>
              <Typography variant="body2">
                • Crear alertas de precio (ej. cuando BTC pase cierto valor).
              </Typography>
              <Typography variant="body2">
                • Agregar gráficos de evolución con cotizaciones históricas.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper className={styles.sectionPaper}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Últimos movimientos y noticias
            </Typography>
            <Typography variant="body2" color="text.secondary">
              En futuras iteraciones acá podés mostrar:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Las últimas operaciones que cargó el inversor.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Un feed de noticias relevantes para sus activos.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Resumen de cambios importantes en cotizaciones del día.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
