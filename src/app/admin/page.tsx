"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, type AuthUser } from "@/services/AuthService";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/auth/login");
      return;
    }
    if (u.rol !== "Admin") {
      router.replace("/access-denied");
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
          Cargando panel de administración...
        </Typography>
      </Box>
    );
  }

  // Datos demo
  const totUsuarios = 48;
  const usuariosHoy = 9;
  const totOperaciones = 1320;
  const operacionesHoy = 37;
  const volumenHoyArs = 12_500_000;
  const volumenHoyUsd = 21_000;
  const totalRecomendaciones = 86;
  const recomendacionesHoy = 12;
  const activosConRecomendaciones = 34;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 96px)",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Grid container spacing={3}>
        {/* HEADER GRANDE */}
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
                    Panel administrador
                  </Typography>
                  <Chip
                    label="Admin"
                    size="small"
                    color="secondary"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Hola {user.nombre}, acá ves un resumen global de usuarios,
                  operaciones y recomendaciones dentro de FinanzApp.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Ver panel de inversor
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(0,255,135,0.35)",
              boxShadow: "0 0 20px rgba(0,255,135,0.20)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Recomendaciones del sistema
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
              {totalRecomendaciones}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 620 }}
            >
              {recomendacionesHoy} recomendaciones generadas hoy y{" "}
              {activosConRecomendaciones} activos distintos referidos en las
              recomendaciones activas.
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
              Usuarios registrados
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {totUsuarios}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {usuariosHoy} usuarios iniciaron sesión hoy.
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
              Operaciones totales
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {totOperaciones}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {operacionesHoy} operaciones cargadas hoy.
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
              Volumen operado hoy
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              ARS {volumenHoyArs.toLocaleString("es-AR")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ≈ USD {volumenHoyUsd.toLocaleString("es-AR")}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(0,255,135,0.25)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Activos con recomendaciones
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {activosConRecomendaciones}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Activos distintos que aparecen en las recomendaciones activas del
              sistema.
            </Typography>
          </Paper>
        </Grid>

        {/* BLOQUE INFERIOR – TAMBIÉN DE A DOS POR FILA */}
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
              Actividad reciente de usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Datos de ejemplo, después los podés poblar desde la base:
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={1.2}>
              <Typography variant="body2">
                • 3 usuarios nuevos registrados en las últimas 24 hs.
              </Typography>
              <Typography variant="body2">
                • 14 usuarios realizaron al menos una operación hoy.
              </Typography>
              <Typography variant="body2">
                • 5 usuarios no entran hace más de 30 días (podrías mandar un
                mail).
              </Typography>
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
              Distribución de operaciones
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              También hardcodeado, para que tengas la maqueta:
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={0.8}>
              <Typography variant="body2">
                • 55% CEDEARs / acciones.
              </Typography>
              <Typography variant="body2">• 30% criptomonedas.</Typography>
              <Typography variant="body2">• 15% bonos / renta fija.</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Más adelante esto lo podés armar con una consulta agregada +
                gráfico.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
