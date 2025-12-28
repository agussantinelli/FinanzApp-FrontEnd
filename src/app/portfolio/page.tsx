"use client";

import * as React from "react";
import Link from "next/link";
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
  Skeleton,
  FormControl,
  InputLabel,
  TableSortLabel,
  IconButton,
  Menu,
  Tooltip
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RoleGuard } from "@/components/auth/RoleGuard";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import styles from "./styles/Portfolio.module.css";
import { formatARS, formatPercentage, formatUSD, formatQuantity } from "@/utils/format";
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CurrencyToggle } from "@/components/common/CurrencyToggle";
import PortfolioCompositionChart from "@/components/portfolio/PortfolioCompositionChart";
// Helper for dynamic formatting
import { usePortfolioSort, Order, OrderBy } from "@/hooks/usePortfolioSort";
import { CreatePortfolioDialog, EditPortfolioDialog } from "@/components/portfolio/PortfolioDialogs";

export default function PortfolioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  const showBackButton = !!urlId;
  // refreshPortfolios updates the list, refresh updates the current selected portfolio details
  const { portfolios, selectedId, valuacion, loading, handlePortfolioChange, refreshPortfolios, refresh } = usePortfolioData();
  const [currency, setCurrency] = React.useState<'ARS' | 'USD'>('USD');

  // UI State
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  // Handle URL ID change
  React.useEffect(() => {
    if (urlId && urlId !== selectedId) {
      handlePortfolioChange(urlId);
    }
  }, [urlId, handlePortfolioChange, selectedId]);

  // Sorting State
  const { order, orderBy, handleRequestSort, sortedActivos } = usePortfolioSort({
    activos: valuacion?.activos,
    currency,
    totalPesos: valuacion?.totalPesos,
    totalDolares: valuacion?.totalDolares
  });

  // Security Check
  const isOwner = React.useMemo(() => {
    if (!valuacion || !portfolios) return false;
    return portfolios.some(p => p.id === valuacion.id);
  }, [valuacion, portfolios]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSwitchPortfolio = (id: string) => {
    handlePortfolioChange(id);
    handleMenuClose();
  };

  const handleCreateSuccess = () => {
    refreshPortfolios();
  };

  const handleEditSuccess = () => {
    refreshPortfolios(); // Update name/desc in list dropdown
    refresh(); // Update name/desc in current view header
  };


  if (loading) {
    return (
      <RoleGuard>
        <Box className={styles.container}>
          <Grid container spacing={3}>
            {/* Header Skeleton */}
            <Grid size={{ xs: 12 }}>
              <Paper className={styles.headerPaper}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ width: '40%' }}>
                    <Skeleton height={50} width="60%" />
                    <Skeleton width="40%" />
                  </Box>
                  <Box sx={{ width: '40%', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Skeleton variant="rounded" width={100} height={40} />
                    <Skeleton variant="rounded" width={150} height={40} />
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            {/* Cards Skeleton */}
            {[1, 2, 3].map((i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Paper className={styles.card}>
                  <Skeleton width="40%" />
                  <Skeleton height={60} width="70%" />
                  <Skeleton width="90%" />
                </Paper>
              </Grid>
            ))}
            {/* Chart Skeleton */}
            <Grid size={{ xs: 12 }}>
              <Paper className={styles.card} sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Skeleton variant="circular" width={250} height={250} />
                <Box sx={{ ml: 4, width: '30%' }}>
                  <Skeleton height={30} width="80%" sx={{ mb: 1 }} />
                  <Skeleton height={30} width="60%" sx={{ mb: 1 }} />
                  <Skeleton height={30} width="70%" sx={{ mb: 1 }} />
                </Box>
              </Paper>
            </Grid>
            {/* Table Skeleton */}
            <Grid size={{ xs: 12 }}>
              <Paper className={styles.tablePaper}>
                <Skeleton height={40} width="30%" sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <Skeleton key={row} height={50} variant="rectangular" sx={{ borderRadius: 1 }} />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </RoleGuard>
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
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/registrar-operacion')}
                  >
                    Registrar Operación
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setCreateOpen(true)}
                  >
                    Crear Nuevo Portafolio
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          <CreatePortfolioDialog
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onSuccess={() => { refreshPortfolios(); setCreateOpen(false); }}
          />
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
              {showBackButton && (
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.back()}
                  sx={{ mb: 2, textTransform: 'none', fontWeight: 600 }}
                  color="inherit"
                >
                  Volver al listado
                </Button>
              )}
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h4" className={styles.headerTitle} sx={{ fontWeight: 700 }}>
                      {valuacion?.nombre || "Mi Portafolio"}
                    </Typography>

                    {/* Change Portfolio */}
                    <Tooltip title="Cambiar de portafolio">
                      <IconButton size="small" onClick={handleMenuClick}>
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {portfolios.map((p) => (
                        <MenuItem
                          key={p.id}
                          selected={p.id === selectedId}
                          onClick={() => handleSwitchPortfolio(p.id)}
                        >
                          {p.nombre}
                        </MenuItem>
                      ))}
                    </Menu>

                    {/* Edit Portfolio - Only Owner */}
                    {isOwner && (
                      <Tooltip title="Editar detalles">
                        <IconButton size="small" onClick={() => setEditOpen(true)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Create Portfolio - Only Owner context (kept visible in My Portfolios view) */}
                    {/* User requested hiding "create" when viewing others. It's confusing context. */}
                    {isOwner && (
                      <Tooltip title="Crear nuevo portafolio">
                        <IconButton size="small" onClick={() => setCreateOpen(true)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {valuacion?.descripcion || "Resumen de tus inversiones."}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />

                  {isOwner && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        onClick={() => router.push('/operaciones/me')}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Mis Operaciones
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/registrar-operacion')}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Registrar Operación
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>
            </Paper>

            <CreatePortfolioDialog
              open={createOpen}
              onClose={() => setCreateOpen(false)}
              onSuccess={handleCreateSuccess}
            />
            <EditPortfolioDialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
              onSuccess={handleEditSuccess}
              portfolio={valuacion ? {
                id: valuacion.id,
                nombre: valuacion.nombre,
                descripcion: valuacion.descripcion || '',
                esPrincipal: valuacion.esPrincipal
              } : null}
            />
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
                {(() => {
                  if (!valuacion) return "-";

                  let gain = currency === 'ARS' ? valuacion.gananciaPesos : valuacion.gananciaDolares;

                  // Fix for potentially missing USD gain
                  if (currency === 'USD' && gain === 0 && valuacion.gananciaPesos !== 0 && valuacion.totalDolares > 0) {
                    const impliedRate = valuacion.totalPesos / valuacion.totalDolares;
                    if (impliedRate > 0) {
                      gain = valuacion.gananciaPesos / impliedRate;
                    }
                  }

                  return (gain > 0 ? "+" : "") + (currency === 'ARS' ? formatARS(gain) : formatUSD(gain));
                })()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Variación total: {(() => {
                  if (!valuacion) return "0";

                  let pct = currency === 'ARS' ? valuacion.variacionPorcentajePesos : valuacion.variacionPorcentajeDolares;
                  let gain = currency === 'ARS' ? valuacion.gananciaPesos : valuacion.gananciaDolares;

                  // Fix for missing USD data
                  if (currency === 'USD' && gain === 0 && valuacion.gananciaPesos !== 0 && valuacion.totalDolares > 0) {
                    const impliedRate = valuacion.totalPesos / valuacion.totalDolares;
                    if (impliedRate > 0) {
                      const estimatedSdkGain = valuacion.gananciaPesos / impliedRate;
                      const cost = valuacion.totalDolares - estimatedSdkGain;
                      if (cost !== 0) {
                        pct = (estimatedSdkGain / cost) * 100;
                      }
                    }
                  }

                  return formatPercentage(pct);
                })()}%
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
                          <Link href={`/activos/${a.activoId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {a.symbol}
                          </Link>
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
    </RoleGuard >
  );
}
