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
  ToggleButtonGroup,
  TableSortLabel
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/auth/RoleGuard";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import styles from "./styles/Portfolio.module.css";
import { formatARS, formatPercentage, formatUSD, formatQuantity } from "@/utils/format";
import AddIcon from '@mui/icons-material/Add';
import { CurrencyToggle } from "@/components/common/CurrencyToggle";
import PortfolioCompositionChart from "@/components/portfolio/PortfolioCompositionChart";

// Helper for dynamic formatting
type Order = 'asc' | 'desc';
type OrderBy = 'symbol' | 'moneda' | 'cantidad' | 'ppc' | 'totalCost' | 'price' | 'currentValue' | 'percentage' | 'performance';

export default function PortfolioPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { portfolios, selectedId, valuacion, loading, handlePortfolioChange } = usePortfolioData();
  const [currency, setCurrency] = React.useState<'ARS' | 'USD'>('USD');

  // Sorting State
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<OrderBy>('currentValue');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedActivos = React.useMemo(() => {
    if (!valuacion?.activos) return [];

    const ccl = (valuacion.totalDolares && valuacion.totalPesos)
      ? valuacion.totalPesos / valuacion.totalDolares
      : 0;

    return [...valuacion.activos].sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      // Helper to get normalized prices for sorting
      const getValues = (asset: typeof a) => {
        const assetCurrency = asset.moneda || "ARS";
        const isAssetUSD = assetCurrency === 'USD' || assetCurrency === 'USDT' || assetCurrency === 'USDC';

        let price = 0;
        let ppc = 0;

        if (currency === 'ARS') {
          price = isAssetUSD ? (ccl > 0 ? asset.precioActual * ccl : 0) : asset.precioActual;
          ppc = isAssetUSD ? (ccl > 0 ? asset.precioPromedioCompra * ccl : 0) : asset.precioPromedioCompra;
        } else {
          price = !isAssetUSD ? (ccl > 0 ? asset.precioActual / ccl : 0) : asset.precioActual;
          ppc = !isAssetUSD ? (ccl > 0 ? asset.precioPromedioCompra / ccl : 0) : asset.precioPromedioCompra;
        }
        return { price, ppc };
      };

      const { price: priceA, ppc: ppcA } = getValues(a);
      const { price: priceB, ppc: ppcB } = getValues(b);

      switch (orderBy) {
        case 'symbol':
          valA = a.symbol;
          valB = b.symbol;
          break;
        case 'moneda':
          valA = a.moneda;
          valB = b.moneda;
          break;
        case 'cantidad':
          valA = a.cantidad;
          valB = b.cantidad;
          break;
        case 'ppc':
          valA = ppcA;
          valB = ppcB;
          break;
        case 'totalCost':
          valA = ppcA * a.cantidad;
          valB = ppcB * b.cantidad;
          break;
        case 'price':
          valA = priceA;
          valB = priceB;
          break;
        case 'currentValue':
          valA = priceA * a.cantidad;
          valB = priceB * b.cantidad;
          break;
        case 'percentage':
          valA = a.porcentajeCartera;
          valB = b.porcentajeCartera;
          break;
        case 'performance':
          valA = a.precioPromedioCompra > 0 ? ((a.precioActual - a.precioPromedioCompra) / a.precioPromedioCompra) : -999;
          valB = b.precioPromedioCompra > 0 ? ((b.precioActual - b.precioPromedioCompra) / b.precioPromedioCompra) : -999;
          break;
      }

      if (valB < valA) {
        return order === 'desc' ? -1 : 1;
      }
      if (valB > valA) {
        return order === 'desc' ? 1 : -1;
      }
      return 0;
    });
  }, [valuacion, order, orderBy, currency]);


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
                  <Typography variant="h4" className={styles.headerTitle} sx={{ fontWeight: 700 }}>Resumen de Portafolio</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {valuacion?.descripcion || "Resumen de tus inversiones."}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />
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
          <Grid size={{ xs: 12 }}>
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
              <Typography variant="h6" className={styles.sectionTitle} gutterBottom sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                Detalle de Activos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    {[
                      { id: 'symbol', label: 'Ticker', align: 'left' },
                      { id: 'moneda', label: 'Moneda', align: 'left' },
                      { id: 'cantidad', label: 'Cantidad', align: 'left' },
                      { id: 'ppc', label: `PPC (${currency})`, align: 'left' },
                      { id: 'totalCost', label: `Costo Total (${currency})`, align: 'left' },
                      { id: 'price', label: `Precio Actual (${currency})`, align: 'left' },
                      { id: 'currentValue', label: `Valor Actual (${currency})`, align: 'left' },
                      { id: 'percentage', label: '% Cartera', align: 'left' },
                      { id: 'performance', label: 'Rendimiento', align: 'left' },
                    ].map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.align as any}
                        sx={{ fontSize: '1rem', fontWeight: 600 }}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={() => handleRequestSort(headCell.id as OrderBy)}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedActivos.map(a => {
                    const assetCurrency = a.moneda || "ARS";
                    const isAssetUSD = assetCurrency === 'USD' || assetCurrency === 'USDT' || assetCurrency === 'USDC';

                    const ccl = (valuacion?.totalDolares && valuacion?.totalPesos)
                      ? valuacion.totalPesos / valuacion.totalDolares
                      : 0;

                    // Normalize Prices
                    let priceARS = 0;
                    let priceUSD = 0;
                    let ppcARS = 0;
                    let ppcUSD = 0;

                    if (isAssetUSD) {
                      priceUSD = a.precioActual;
                      priceARS = ccl > 0 ? priceUSD * ccl : 0;

                      ppcUSD = a.precioPromedioCompra;
                      ppcARS = ccl > 0 ? ppcUSD * ccl : 0;
                    } else {
                      priceARS = a.precioActual;
                      priceUSD = ccl > 0 ? priceARS / ccl : 0;

                      ppcARS = a.precioPromedioCompra;
                      ppcUSD = ccl > 0 ? ppcARS / ccl : 0;
                    }

                    const totalARS = priceARS * a.cantidad;
                    const totalUSD = priceUSD * a.cantidad;

                    const priceToShow = currency === 'ARS' ? priceARS : priceUSD;
                    const totalToShow = currency === 'ARS' ? totalARS : totalUSD;
                    const ppcToShow = currency === 'ARS' ? ppcARS : ppcUSD;

                    // New Calculation: Total Purchase Cost (Costo Total)
                    const totalCostToShow = ppcToShow * a.cantidad;

                    const formatFn = currency === 'ARS' ? formatARS : formatUSD;

                    const varPct = a.precioPromedioCompra > 0 ? ((a.precioActual - a.precioPromedioCompra) / a.precioPromedioCompra * 100) : 0;
                    return (
                      <TableRow key={a.activoId}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                          {a.symbol}
                          {a.tipoActivo === "Cedear" && (
                            <Chip label="CEDEAR" size="small" sx={{ ml: 1, fontSize: '0.65rem', height: 20 }} variant="outlined" color="primary" />
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '1rem' }}>
                          <Chip label={assetCurrency} size="small" variant="outlined" sx={{ fontSize: '0.75rem', height: 24, minWidth: 45 }} color={isAssetUSD ? "success" : "default"} />
                        </TableCell>
                        <TableCell align="left" sx={{ fontSize: '1rem' }}>{formatQuantity(a.cantidad)}</TableCell>

                        {/* PPC */}
                        <TableCell align="left" sx={{ fontSize: '1rem' }}>{formatFn(ppcToShow)}</TableCell>

                        {/* Costo Total */}
                        <TableCell align="left" sx={{ fontSize: '1rem' }}>{formatFn(totalCostToShow)}</TableCell>

                        {/* Precio Actual */}
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{formatFn(priceToShow)}</TableCell>

                        {/* Valor Actual */}
                        <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{formatFn(totalToShow)}</TableCell>

                        <TableCell align="left" sx={{ fontSize: '1rem' }}>{formatPercentage(a.porcentajeCartera)}%</TableCell>
                        <TableCell align="left" sx={{ color: varPct >= 0 ? 'success.main' : 'error.main', fontSize: '1rem', fontWeight: 500 }}>
                          {varPct > 0 ? "+" : ""}{formatPercentage(varPct)}%
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {(!valuacion?.activos || valuacion.activos.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
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
