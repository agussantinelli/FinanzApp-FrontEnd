"use client";

import { useCedearsData } from "@/hooks/useCedearsData";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import styles from "./styles/CedearsSection.module.css";

function formatARS(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
}
function formatUSD(n?: number | null) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const COMPANY: Record<string, string> = {
  "AAPL.BA": "Apple", "AMZN.BA": "Amazon", "NVDA.BA": "NVIDIA",
  "MSFT.BA": "Microsoft", "GOOGL.BA": "Alphabet", "META.BA": "Meta",
  "TSLA.BA": "Tesla", "BRKB.BA": "Berkshire Hathaway", "KO.BA": "Coca-Cola Company",
};

export default function CedearsSection() {
  const {
    rows,
    withDerived,
    loading,
    updatedAt,
    fetchData
  } = useCedearsData();

  const UnifiedCard = (d: DualQuoteDTO) => {
    const isCedearLocal = d.cedearRatio != null;
    const company = COMPANY[d.localSymbol?.toUpperCase() || ""] ?? d.usSymbol;
    return (
      <Card className={styles.cedearCard}>
        <CardContent>
          <Typography variant="h6" className={styles.cardTitle}>
            {company}
          </Typography>

          <Typography variant="caption" className={styles.cardSubtitle}>
            {isCedearLocal ? `Precio local = CEDEAR · Ratio ${d.cedearRatio}:1` : "Precio local = Acción BYMA (no CEDEAR)"}
          </Typography>

          <Typography className={styles.cardSymbol}>
            {d.localSymbol} ↔ {d.usSymbol}
          </Typography>

          <Typography className={styles.cardText}>
            CEDEAR (ARS): <strong>{formatARS(d.localPriceARS)}</strong>
            {d.localChangePct !== undefined && d.localChangePct !== null && (
              <span className={`${styles.changePercent} ${d.localChangePct >= 0 ? styles.positive : styles.negative}`}>
                {d.localChangePct > 0 ? "+" : ""}{d.localChangePct}%
              </span>
            )}
          </Typography>
          <Typography>
            Acción USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong>
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
          <Typography variant="h5" className={styles.headerTitle}>
            CEDEARs ↔ Acción USA
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

      {withDerived.length === 0 && !loading && (
        <Typography color="text.secondary">No se encontraron cotizaciones.</Typography>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        {rows.map((row, idx) => (
          <Grid key={idx} container spacing={3} justifyContent="center">
            {row.map(d => (
              <Grid size={{ xs: 12, md: 4 }} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
    </Paper>
  );
}
