"use client";

import { useCallback, useEffect, useState } from "react";
import { getTopCryptos } from "@/services/CryptoService";
import { CryptoTopDTO } from "@/types/Crypto";
import {
  Paper, Typography, Button, Divider, Box,
  CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import styles from "./styles/CryptoSection.module.css";
import CryptoCard from "@/components/cards/CryptoCard";

export default function CryptoSection() {
  const [data, setData] = useState<CryptoTopDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getTopCryptos();
    setData(res);
    setUpdatedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  return (
    <Paper className={styles.sectionPaper}>
      <div className={styles.headerContainer}>
        <Box>
          <Typography variant="h5" className={styles.headerTitle}>
            CriptoMonedas Top 10 por Market Cap
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Precios en USD — fuente: CoinGecko.
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

      <Box className={styles.gridContainer}>
        {data.map((c) => (
          <CryptoCard key={c.symbol} data={c} />
        ))}
      </Box>
    </Paper>
  );
}
