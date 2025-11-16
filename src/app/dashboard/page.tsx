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

    // Si quisieras redirigir admin a otra página:
    // if (u.rol === "Admin") {
    //   router.replace("/admin");
    //   return;
    // }

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
          Cargando tu panel de inversor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 96px)",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Grid container spacing={3}>
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
                    Hola, {user.nombre} 👋
                  </Typography>
                  <Chip
                    label={user.rol === "Admin" ? "Admin" : "Inversor"}
                    size="small"
                    color={user.rol === "Admin" ? "secondary" : "primary"}
                    sx={{ fontWeight: 600 }}
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
                  sx={{ textTransform: "none" }}
                >
                  Ver perfil
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
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
              Valor estimado del portafolio
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              $ 0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              En la próxima iteración podés sumar la suma de tus posiciones en
              CEDEARs, acciones y cripto.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Resultado diario (P&L)
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, mt: 0.5, color: "#39ff14" }}
            >
              + 0,00 %
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Acá podrías calcular variación diaria de tu cartera a partir de
              las últimas cotizaciones.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Cantidad de activos
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Número de instrumentos distintos en los que invertís (CEDEARs,
              acciones, bonos, cripto, etc.).
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Exposición en cripto
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              0 %
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Más adelante podés calcular qué porcentaje de tu portafolio está
              en criptomonedas.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
                  sx={{ textTransform: "none" }}
                >
                  Ver
                </Button>
              </Stack>

              <Divider flexItem sx={{ my: 1 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
                  sx={{ textTransform: "none" }}
                >
                  Ver
                </Button>
              </Stack>

              <Divider flexItem sx={{ my: 1 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
                  sx={{ textTransform: "none" }}
                >
                  Ver
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
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
