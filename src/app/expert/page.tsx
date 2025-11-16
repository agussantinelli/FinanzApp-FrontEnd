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
import { getCurrentUser, type AuthUser } from "@/services/AuthService";

export default function ExpertDashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/auth/login");
      return;
    }

    if (u.rol !== "Experto") {
      router.replace("/expert/access-denied");
      return;
    }

    setUser(u);
    setChecking(false);
  }, [router]);

  if (checking || !user) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 96px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
    <Box
      sx={{
        minHeight: "calc(100vh - 96px)",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Grid container spacing={3}>
        {/* HEADER FULL WIDTH */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "rgba(15,15,15,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
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
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 800, mb: 0.5, letterSpacing: 0.4 }}
                  >
                    Panel experto
                  </Typography>
                  <Chip
                    label="Experto"
                    size="small"
                    color="secondary"
                    sx={{ fontWeight: 600 }}
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
                  sx={{ textTransform: "none" }}
                >
                  Ver mi portafolio
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* CARD GRANDE: RESUMEN DE RECOMENDACIONES */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(0,255,135,0.3)",
              boxShadow: "0 0 18px rgba(0,255,135,0.12)",
            }}
          >
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
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
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
                    sx={{ fontWeight: 700, mb: 0.2 }}
                  >
                    Hoy
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {recomendacionesHoy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    nuevas recomendaciones generadas.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 0.2 }}
                  >
                    Activos cubiertos
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
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

        {/* FILA DE 2 CARDS: INVERSORES & LISTAS */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Alcance entre inversores
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
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

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Listas y carteras modelo
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
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

        {/* FILA DE 2 CARDS: PERFORMANCE & HORIZONTE */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(0,255,135,0.3)",
              boxShadow: "0 0 18px rgba(0,255,135,0.12)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Desempeño estimado
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mt: 0.5, color: "#39ff14" }}
            >
              {tasaAcierto}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              tasa de acierto de tus recomendaciones (demo). Después podés
              calcularlo con precios históricos de los activos.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Horizonte de inversión
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
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

        {/* CARD GRANDE ABAJO: ROADMAP DEL EXPERTO */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
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
