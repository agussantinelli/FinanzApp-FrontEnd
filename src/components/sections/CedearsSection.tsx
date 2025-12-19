"use client";

import { useCedearsData } from "@/hooks/useCedearsData";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Typography, Button, Grid,
  CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import styles from "./styles/CedearsSection.module.css";
import StocksCard from "@/components/cards/StocksCard";




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
                <StocksCard data={d} title={COMPANY[d.localSymbol?.toUpperCase() || ""] ?? d.usSymbol} />
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
    </Paper>
  );
}
