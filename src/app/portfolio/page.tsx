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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type PositionRow = {
  ticker: string;
  nombre: string;
  tipo: "CEDEAR" | "Acción" | "Cripto" | "Bono";
  cantidad: number;
  precioActualArs: number;
  valorTotalArs: number;
  variacionDiaPct: number;
  variacionTotalPct: number;
};

const mockPositions: PositionRow[] = [
  {
    ticker: "AAPL",
    nombre: "Apple (CEDEAR)",
    tipo: "CEDEAR",
    cantidad: 15,
    precioActualArs: 52000,
    valorTotalArs: 780000,
    variacionDiaPct: 1.2,
    variacionTotalPct: 18.7,
  },
  {
    ticker: "GGAL",
    nombre: "Banco Galicia",
    tipo: "Acción",
    cantidad: 120,
    precioActualArs: 1250,
    valorTotalArs: 150000,
    variacionDiaPct: -0.8,
    variacionTotalPct: 5.3,
  },
  {
    ticker: "BTC",
    nombre: "Bitcoin",
    tipo: "Cripto",
    cantidad: 0.035,
    precioActualArs: 35000000,
    valorTotalArs: 1225000,
    variacionDiaPct: 2.4,
    variacionTotalPct: 32.1,
  },
  {
    ticker: "AL30",
    nombre: "Bono AL30",
    tipo: "Bono",
    cantidad: 300,
    precioActualArs: 4100,
    valorTotalArs: 1230000,
    variacionDiaPct: 0.3,
    variacionTotalPct: 9.8,
  },
];

import styles from "./styles/Portfolio.module.css";


export default function PortfolioPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography variant="body1" color="text.secondary">
          Cargando tu portafolio...
        </Typography>
      </Box>
    );
  }

  const totalValor = mockPositions.reduce(
    (acc, p) => acc + p.valorTotalArs,
    0
  );

  const totalCripto = mockPositions
    .filter((p) => p.tipo === "Cripto")
    .reduce((acc, p) => acc + p.valorTotalArs, 0);

  const totalRiesgo = mockPositions
    .filter((p) => p.tipo === "Cripto" || p.tipo === "Acción")
    .reduce((acc, p) => acc + p.valorTotalArs, 0);

  const exposicionCriptoPct =
    totalValor > 0 ? (totalCripto / totalValor) * 100 : 0;

  const exposicionRiesgoPct =
    totalValor > 0 ? (totalRiesgo / totalValor) * 100 : 0;

  const totalActivos = mockPositions.length;

  return (
    <Box className={styles.container}>
      <Grid container spacing={3}>
        {/* HEADER */}
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
                    Mi portafolio
                  </Typography>
                  <Chip
                    label={user.rol}
                    size="small"
                    color={user.rol === "Admin" ? "secondary" : "primary"}
                    className={styles.roleChip}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Resumen de tus posiciones en CEDEARs, acciones, bonos y
                  criptomonedas (datos de ejemplo).
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  className={styles.actionButton}
                >
                  Exportar a PDF
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  className={styles.actionButton}
                >
                  Cargar operación
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* CARDS RESUMEN */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className={`${styles.card} ${styles.highlightCard}`}>
            <Typography variant="caption" color="text.secondary">
              Valor total del portafolio
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              ARS {totalValor.toLocaleString("es-AR")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Suma del valor estimado de todas tus posiciones actuales.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Exposición en activos de riesgo
            </Typography>
            <Typography
              variant="h5"
              className={`${styles.cardValue} ${styles.neonGreenText}`}
            >
              {exposicionRiesgoPct.toFixed(1)} %
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Acciones + criptos sobre el total del portafolio.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className={styles.card}>
            <Typography variant="caption" color="text.secondary">
              Cantidad de activos distintos
            </Typography>
            <Typography variant="h5" className={styles.cardValue}>
              {totalActivos}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Número de instrumentos diferentes que componen tu portafolio.
            </Typography>
          </Paper>
        </Grid>

        {/* DISTRIBUCIONES */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className={styles.distributionsPaper}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Distribución por tipo de activo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ejemplo de cómo podrías mostrar el mix de cartera.
            </Typography>

            <Stack spacing={1.2}>
              <Typography variant="body2">
                • CEDEARs / acciones: ~55% del valor total.
              </Typography>
              <Typography variant="body2">
                • Bonos / renta fija: ~25% del valor total.
              </Typography>
              <Typography variant="body2">
                • Criptomonedas: ~{exposicionCriptoPct.toFixed(1)}% del total.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Más adelante esto se puede reemplazar por un gráfico de torta
                con datos reales desde la base.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className={styles.distributionsPaper}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Ideas para evolucionar el portafolio
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Algunas funcionalidades futuras para el TP:
            </Typography>

            <Stack spacing={1.2}>
              <Typography variant="body2">
                • Guardar cada operación (compra/venta) y reconstruir la
                posición histórica.
              </Typography>
              <Typography variant="body2">
                • Calcular rentabilidad total y anualizada de cada activo.
              </Typography>
              <Typography variant="body2">
                • Marcar activos objetivo recomendados por expertos.
              </Typography>
              <Typography variant="body2">
                • Agregar alertas por mail / push cuando un activo salga de un
                rango de precio.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* TABLA DE POSICIONES */}
        <Grid size={{ xs: 12 }}>
          <Paper className={styles.tablePaper}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={1.5}
              className={styles.tableHeaderStack}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Posiciones actuales
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tabla demo, después podés enlazarla con los datos reales de
                  la base / API.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                className={styles.actionButton}
              >
                Filtrar / ordenar
              </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ticker</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio actual (ARS)</TableCell>
                    <TableCell align="right">Valor total (ARS)</TableCell>
                    <TableCell align="right">Var. día</TableCell>
                    <TableCell align="right">Var. total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockPositions.map((p) => (
                    <TableRow key={p.ticker}>
                      <TableCell>{p.ticker}</TableCell>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell>{p.tipo}</TableCell>
                      <TableCell align="right">{p.cantidad}</TableCell>
                      <TableCell align="right">
                        {p.precioActualArs.toLocaleString("es-AR")}
                      </TableCell>
                      <TableCell align="right">
                        {p.valorTotalArs.toLocaleString("es-AR")}
                      </TableCell>
                      <TableCell
                        align="right"
                        className={
                          p.variacionDiaPct > 0
                            ? styles.positiveChange
                            : p.variacionDiaPct < 0
                              ? styles.negativeChange
                              : styles.neutralChange
                        }
                      >
                        {p.variacionDiaPct > 0 ? "+" : ""}
                        {p.variacionDiaPct.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        align="right"
                        className={
                          p.variacionTotalPct > 0
                            ? styles.positiveChange
                            : p.variacionTotalPct < 0
                              ? styles.negativeChange
                              : styles.neutralChange
                        }
                      >
                        {p.variacionTotalPct > 0 ? "+" : ""}
                        {p.variacionTotalPct.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
