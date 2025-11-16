"use client";

import * as React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUser,
  clearAuthSession,
  type AuthUser,
} from "@/services/AuthService";

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const u = getCurrentUser();

    if (!u) {
      // No logueado → al login
      router.replace("/auth/login");
      return;
    }

    if (u.rol === "Admin") {
      router.replace("/admin");
      return;
    }

    setUser(u);
    setChecking(false);
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push("/auth/login");
  };

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
          Cargando panel...
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
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, mb: 0.5, letterSpacing: 0.4 }}
                >
                  Hola, {user.nombre} 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este es tu panel de inversor en FinanzApp. Desde acá vas a poder
                  seguir el dólar, tus CEDEARs, acciones, cripto y reportes.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  component={Link}
                  href="/auth/me" // si después armás un perfil
                  sx={{ textTransform: "none" }}
                >
                  Ver perfil
                </Button>
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  onClick={handleLogout}
                  sx={{ textTransform: "none" }}
                >
                  Cerrar sesión
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* CARDS PRINCIPALES */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(0,255,135,0.3)",
              boxShadow: "0 0 18px rgba(0,255,135,0.12)",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Dólar & tipos de cambio
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Cotizaciones en tiempo real
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              MEP, CCL, tarjeta y oficiales en un solo lugar. Ideal para
              calcular tu costo de entrada/salida.
            </Typography>
            <Button
              component={Link}
              href="/dolar"
              size="small"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Ver cotizaciones
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              CEDEARs & acciones
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Duales local / USA
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Compará precios entre CEDEAR y acción en NY, calculá CCL implícito
              y detectá oportunidades rápido.
            </Typography>
            <Button
              component={Link}
              href="/cedears"
              size="small"
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Ver CEDEARs
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Criptomonedas
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Top market cap
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              BTC, ETH y las principales altcoins con precio en USD y estimación
              en pesos según el dólar que elijas.
            </Typography>
            <Button
              component={Link}
              href="/crypto"
              size="small"
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Ver cripto
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "rgba(10,10,10,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Reportes & análisis
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Resumen de tu portafolio
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Reportes de posición, P&L y exposición por activo/moneda. Ideal
              para imprimir o compartir.
            </Typography>
            <Button
              component={Link}
              href="/reportes"
              size="small"
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Ver reportes
            </Button>
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
              Próximamente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acá podés sumar tus últimos movimientos, alertas personalizadas o
              un resumen rápido de tu cartera. Por ahora lo dejamos como lugar
              reservado para la próxima iteración del TP.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
