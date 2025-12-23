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
  InputLabel,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import styles from "./styles/Portfolio.module.css";
import { formatARS, formatPercentage, formatUSD } from "@/utils/format";
import AddIcon from '@mui/icons-material/Add';
import PortfolioCompositionChart from "@/components/portfolio/PortfolioCompositionChart";

export default function PortfolioPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { portfolios, selectedId, valuacion, loading, handlePortfolioChange } = usePortfolioData();
  const [currency, setCurrency] = React.useState<'ARS' | 'USD'>('USD');

  const handleCurrencyChange = (
    event: React.MouseEvent<HTMLElement>,
    newCurrency: 'ARS' | 'USD' | null,
  ) => {
    if (newCurrency !== null) {
      setCurrency(newCurrency);
    }
  };

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
                  <ToggleButtonGroup
                    value={currency}
                    exclusive
                    onChange={handleCurrencyChange}
                    aria-label="currency"
                    size="small"
                    sx={{ height: 32 }}
                  >
                    <ToggleButton
                      value="ARS"
                      aria-label="ARS"
                      sx={{
                        fontSize: '0.75rem',
                        color: 'success.main',
                        borderColor: 'success.main',
                        '&.Mui-selected': {
                          color: 'white',
                          backgroundColor: 'success.main',
                          borderColor: 'success.main',
                          '&:hover': {
                            backgroundColor: 'success.dark',
                          }
                        }
                      }}
                    >
                      ARS
                    </ToggleButton>
                    <ToggleButton
                      value="USD"
                      aria-label="USD"
                      sx={{
                        fontSize: '0.75rem',
                        color: 'success.main',
                        borderColor: 'success.main',
                        '&.Mui-selected': {
                          color: 'white',
                          backgroundColor: 'success.main',
                          borderColor: 'success.main',
                          '&:hover': {
                            backgroundColor: 'success.dark',
                          }
                        }
                      }}
                    >
                      USD
                    </ToggleButton>
                  </ToggleButtonGroup>
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
              <Typography variant="caption" color="text.secondary">Valor Total ({currency})</Typography>
              <Typography variant="h4" className={styles.cardValue}>
                {valuacion
                  ? (currency === 'ARS' ? formatARS(valuacion.totalPesos) : formatUSD(valuacion.totalDolares))
                  : (currency === 'ARS' ? "$ -" : "USD -")
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currency === 'ARS'
                  ? `USD ${valuacion?.totalDolares?.toLocaleString("es-AR") ?? "0"}`
                  : `ARS ${valuacion?.totalPesos?.toLocaleString("es-AR") ?? "0"}`
                }
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper className={styles.card}>
              <Typography variant="caption" color="text.secondary">Ganancia/Pérdida ({currency})</Typography>
              <Typography variant="h4" className={`${styles.cardValue} ${(currency === 'ARS' ? (valuacion?.gananciaPesos ?? 0) : (valuacion?.gananciaDolares ?? 0)) >= 0 ? styles.positiveChange : styles.negativeChange}`}>
                {valuacion
                  ? (
                    currency === 'ARS'
                      ? (valuacion.gananciaPesos > 0 ? "+" : "") + formatARS(valuacion.gananciaPesos)
                      : (valuacion.gananciaDolares > 0 ? "+" : "") + formatUSD(valuacion.gananciaDolares)
                  )
                  : "-"
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Variación total: {valuacion
                  ? formatPercentage(currency === 'ARS' ? valuacion.variacionPorcentajePesos : valuacion.variacionPorcentajeDolares)
                  : "0"}%
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
            <PortfolioCompositionChart
              activos={valuacion?.activos || []}
              totalPesos={valuacion?.totalPesos}
              totalDolares={valuacion?.totalDolares}
              currency={currency}
            />
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
                    <TableCell>Moneda</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">PPC</TableCell>
                    <TableCell align="right">Precio ({currency})</TableCell>
                    <TableCell align="right">Total ({currency})</TableCell>
                    <TableCell align="right">% Cartera</TableCell>
                    <TableCell align="right">Resultado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuacion?.activos?.map(a => {
                    const assetCurrency = a.moneda || "ARS";
                    const isAssetUSD = assetCurrency === 'USD' || assetCurrency === 'USDT' || assetCurrency === 'USDC';
                    const fmtPrice = (val: number) => isAssetUSD ? formatUSD(val) : formatARS(val);

                    const ccl = (valuacion.totalDolares && valuacion.totalPesos)
                      ? valuacion.totalPesos / valuacion.totalDolares
                      : 0;

                    // Normalize Prices
                    let priceARS = 0;
                    let priceUSD = 0;

                    if (isAssetUSD) {
                      priceUSD = a.precioActual;
                      priceARS = ccl > 0 ? priceUSD * ccl : 0;
                    } else {
                      priceARS = a.precioActual;
                      priceUSD = ccl > 0 ? priceARS / ccl : 0;
                    }

                    const totalARS = priceARS * a.cantidad;
                    const totalUSD = priceUSD * a.cantidad;

                    const priceToShow = currency === 'ARS' ? priceARS : priceUSD;
                    const totalToShow = currency === 'ARS' ? totalARS : totalUSD;
                    const formatFn = currency === 'ARS' ? formatARS : formatUSD;

                    const varPct = a.precioPromedioCompra > 0 ? ((a.precioActual - a.precioPromedioCompra) / a.precioPromedioCompra * 100) : 0;
                    return (
                      <TableRow key={a.activoId}>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {a.symbol}
                          {a.tipoActivo === "Cedear" && (
                            <Chip label="CEDEAR" size="small" sx={{ ml: 1, fontSize: '0.65rem', height: 20 }} variant="outlined" color="primary" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip label={assetCurrency} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 24, minWidth: 45 }} color={isAssetUSD ? "success" : "default"} />
                        </TableCell>
                        <TableCell align="right">{a.cantidad}</TableCell>
                        <TableCell align="right">{fmtPrice(a.precioPromedioCompra)}</TableCell>

                        {/* Comparison Columns */}
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatFn(priceToShow)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatFn(totalToShow)}</TableCell>

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
