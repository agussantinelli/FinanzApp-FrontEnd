"use client";

import { useStocksData } from "@/hooks/useStocksData";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Alert, Typography, Button, Card, CardContent,
  CircularProgress, Divider, Grid, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import styles from "./styles/AccionesARGYSection.module.css";

function formatARS(val: number) {
  return val.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function formatUSD(val: number | null | undefined) {
  if (val === undefined || val === null || isNaN(val)) return "N/A";
  return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function AccionesARSection() {
  const {
    rowsEnergetico,
    rowsBancario,
    rowsExtra,
    loading,
    error,
    updatedAt,
    fetchData
  } = useStocksData();

  const UnifiedCard = (d: DualQuoteDTO & { name?: string }) => {
    const isCedearLocal = d.cedearRatio != null;
    return (
      <Card className={styles.accionesCard}>
        <CardContent>
          <Typography variant="h6" className={styles.cardTitle}>
            {d.name ?? d.usSymbol}
          </Typography>

          <Typography variant="caption" className={styles.cardSubtitle}>
            {isCedearLocal ? `Precio local = CEDEAR · Ratio ${d.cedearRatio}:1` : "Precio local = Acción BYMA (no CEDEAR)"}
          </Typography>

          <Typography className={styles.cardSymbol}>
            {d.localSymbol} ↔ {d.usSymbol}
          </Typography>

          <Typography className={styles.cardText}>
            Local (ARS): <strong>{formatARS(d.localPriceARS)}</strong>
            {d.localChangePct !== undefined && d.localChangePct !== null && (
              <span className={`${styles.changePercent} ${d.localChangePct >= 0 ? styles.positive : styles.negative}`}>
                {d.localChangePct > 0 ? "+" : ""}{d.localChangePct}%
              </span>
            )}
          </Typography>
          <Typography>
            USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong>
            {d.usChangePct !== undefined && d.usChangePct !== null && (
              <span className={`${styles.changePercent} ${d.usChangePct >= 0 ? styles.positive : styles.negative}`}>
                {d.usChangePct > 0 ? "+" : ""}{d.usChangePct}%
              </span>
            )}
          </Typography>

          <Typography variant="caption" color="text.secondary" className={styles.cardRate}>
            Tasa (CCL): {d.usedDollarRate.toLocaleString("es-AR")}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper className={styles.sectionPaper}>
      <div className={styles.headerContainer}>
        <Box>
          {error && <Alert severity="error" className={styles.errorAlert}>{error}</Alert>}
          <Typography variant="h5" className={styles.headerTitle}>
            Empresas Argentinas ↔ ADR / CEDEARs
          </Typography>
          {updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </Box>
        <Button
          onClick={fetchData}
          variant="outlined"
          color="primary"
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
          disabled={loading}
          className={styles.refreshButton}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <Divider className={styles.sectionDivider} />

      <Typography variant="subtitle1" className={styles.sectionSubtitle}>
        Sector Energético
      </Typography>
      <Box display="flex" flexDirection="column" gap={3}>
        {rowsEnergetico.map((row, idx) => (
          <Grid container spacing={3} key={`en-${idx}`} justifyContent="center">
            {row.map(d => (
              <Grid size={{ xs: 12, md: 4 }} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>

      <Divider className={styles.sectionDividerSoft} />

      <Typography variant="subtitle1" className={styles.sectionSubtitle}>
        Sector Bancario
      </Typography>
      <Box display="flex" flexDirection="column" gap={3}>
        {rowsBancario.map((row, idx) => (
          <Grid container spacing={3} key={`ban-${idx}`} justifyContent="center">
            {row.map(d => (
              <Grid size={{ xs: 12, md: 4 }} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>

      <Divider className={styles.sectionDividerSoft} />

      <Typography variant="subtitle1" className={styles.sectionSubtitle}>
        Otros
      </Typography>
      <Box display="flex" flexDirection="column" gap={3}>
        {rowsExtra.map((row, idx) => (
          <Grid container spacing={3} key={`ex-${idx}`} justifyContent="center">
            {row.map(d => (
              <Grid size={{ xs: 12, md: 4 }} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
    </Paper >
  );
}