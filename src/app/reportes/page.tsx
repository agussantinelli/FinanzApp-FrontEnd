"use client";

import React, { useState } from "react";
import { Typography, Box, Paper, Stack, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import DolarBarChart from "@/components/charts/DolarBarChart";
import styles from "./styles/Reportes.module.css";
import PageHeader from "@/components/ui/PageHeader";
import PortfolioCompositionChart from "@/components/portfolio/PortfolioCompositionChart";
import { useAuth } from "@/hooks/useAuth";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { CurrencyToggle } from "@/components/common/CurrencyToggle";
import Link from "next/link";
import { Button } from "@mui/material";

export default function Reportes() {
  const { user, isAuthenticated } = useAuth();
  const { valuacion, loading } = usePortfolioData();
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('USD');

  return (
    <main className={styles.container}>
      <Box className={styles.maxWidthContainer}>
        <PageHeader
          title="Reportes"
          subtitle="Análisis y Métricas"
          description="Vista preliminar de tus métricas financieras y variaciones de mercado."
        />

        <Grid container spacing={3}>
          {/* Portfolio Chart Section - Visible only to logged in users */}
          {isAuthenticated && (
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Tu Portafolio</Typography>
                <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />
              </Stack>

              {loading && !valuacion ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                valuacion?.activos && valuacion.activos.length > 0 ? (
                  <PortfolioCompositionChart
                    activos={valuacion.activos}
                    totalPesos={valuacion.totalPesos}
                    totalDolares={valuacion.totalDolares}
                    currency={currency}
                  />
                ) : (
                  <Paper className={styles.gradientCard} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" gutterBottom>No tienes activos en tu portafolio para mostrar.</Typography>
                    <Button component={Link} href="/registrar-operacion" variant="outlined" size="small">
                      Registrar Operación
                    </Button>
                  </Paper>
                )
              )}
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 8 }}>
            <Box mb={2}>
              <Typography variant="h6">Cotización Dólar</Typography>
            </Box>
            <DolarBarChart />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box className={styles.gradientCard}>
              <Typography variant="h6">Resumen rápido</Typography>
              <Typography variant="body2" color="text.secondary">
                Próximamente: Patrimonio total, distribución por clase y alertas personalizadas.
              </Typography>
              <Box className={styles.widgetPlaceholder}>
                <Typography variant="caption">Widget en construcción</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
