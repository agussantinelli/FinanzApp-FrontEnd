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
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import styles from "./styles/Portfolio.module.css";
import { formatARS, formatPercentage } from "@/utils/format";
import AddIcon from '@mui/icons-material/Add';
import PortfolioCompositionChart from "@/components/portfolio/PortfolioCompositionChart";

export default function PortfolioPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { portfolios, selectedId, valuacion, loading, handlePortfolioChange } = usePortfolioData();

  if (loading && !valuacion && portfolios.length === 0) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (!loading && portfolios.length === 0) {
    return (
      <RoleGuard>
        <Box className={styles.container}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "60vh" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.card} sx={{ textAlign: 'center', py: 6, px: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Tu portafolio está vacío
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Actualmente no tienes ningún portafolio activo ni posiciones registradas.
                  Comienza operando para ver tus inversiones aquí.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/registrar-operacion')}
                  sx={{ mt: 2 }}
                >
                  Registrar Operación
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard>
      <Box className={styles.container}>
        <Grid container spacing={3}>
          {/* HEADER */}
          <Grid size={{ xs: 12 }}>
            <Paper className={styles.headerPaper}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>
                  <Typography variant="h4" className={styles.headerTitle}>Mi Portafolio</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {valuacion?.descripcion || "Resumen de tus inversiones."}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/registrar-operacion')}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Registrar Operación
                  </Button>
                  {portfolios.length > 1 && (
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Portafolio</InputLabel>
                      <Select value={selectedId} label="Portafolio" onChange={(e) => handlePortfolioChange(e.target.value)}>
                        {portfolios.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* CARDS */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={`${styles.card} ${styles.highlightCard}`}>
              <Typography variant="caption" color="text.secondary">Valor Total</Typography>
              <Typography variant="h4" className={styles.cardValue}>
                {formatARS(valuacion?.totalPesos ?? 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                USD {valuacion?.totalDolares?.toLocaleString("es-AR") ?? "0"}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={styles.card}>
              <Typography variant="caption" color="text.secondary">Ganancia/Pérdida (ARS)</Typography>
              <Typography variant="h4" className={`${styles.cardValue} ${(valuacion?.gananciaPesos ?? 0) >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                {valuacion?.gananciaPesos ? (valuacion.gananciaPesos > 0 ? "+" : "") + formatARS(valuacion.gananciaPesos) : "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Variación total: {valuacion?.variacionPorcentajePesos ? formatPercentage(valuacion.variacionPorcentajePesos) : "0"}%
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={styles.card}>
              <Typography variant="caption" color="text.secondary">Activos en Cartera</Typography>
              <Typography variant="h4" className={styles.cardValue}>
                {valuacion?.activos?.length ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Instrumentos distintos.</Typography>
            </Paper>
          </Grid>

          {/* COMPOSITION CHART */}
          <Grid size={{ xs: 12, md: 8 }}>
            <PortfolioCompositionChart activos={valuacion?.activos || []} />
          </Grid>

          {/* TABLE */}
          <Grid size={{ xs: 12 }}>
            <Paper className={styles.tablePaper}>
              <Typography variant="h6" className={styles.sectionTitle} gutterBottom>Composición</Typography>
              <Divider sx={{ mb: 2 }} />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ticker</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">PPC</TableCell>
                    <TableCell align="right">Precio Actual</TableCell>
                    <TableCell align="right">Total (ARS)</TableCell>
                    <TableCell align="right">% Cartera</TableCell>
                    <TableCell align="right">Resultado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuacion?.activos?.map(a => {
                    const totalVal = a.cantidad * a.precioActual;
                    const varPct = a.precioPromedioCompra > 0 ? ((a.precioActual - a.precioPromedioCompra) / a.precioPromedioCompra * 100) : 0;
                    return (
                      <TableRow key={a.activoId}>
                        <TableCell sx={{ fontWeight: 'bold' }}>{a.symbol}</TableCell>
                        <TableCell align="right">{a.cantidad}</TableCell>
                        <TableCell align="right">{formatARS(a.precioPromedioCompra)}</TableCell>
                        <TableCell align="right">{formatARS(a.precioActual)}</TableCell>
                        <TableCell align="right">{formatARS(totalVal)}</TableCell>
                        <TableCell align="right">{formatPercentage(a.porcentajeCartera)}%</TableCell>
                        <TableCell align="right" sx={{ color: varPct >= 0 ? 'success.main' : 'error.main' }}>
                          {varPct > 0 ? "+" : ""}{formatPercentage(varPct)}%
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {(!valuacion?.activos || valuacion.activos.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          Aún no tienes activos en este portafolio.
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => router.push('/registrar-operacion')}
                          sx={{ mt: 1 }}
                        >
                          Registrar Primera Operación
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  );
}
