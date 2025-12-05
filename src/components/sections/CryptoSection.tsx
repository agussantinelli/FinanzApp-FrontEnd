"use client";

import { useCallback, useEffect, useState } from "react";
import { getTopCryptos } from "@/services/CryptoService";
import { CryptoTopDTO } from "@/types/Crypto";
import {
  Paper, Stack, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import "./styles/CryptoSection.css";

function formatUSD(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

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
    <Paper className="section-paper">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" className="header-title">
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
          className="refresh-button"
        >
          {loading ? "Actualizando..." : "ACTUALIZAR"}
        </Button>
      </Stack>

      <Divider className="section-divider" />

      <Stack spacing={{ xs: 2, md: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {data.slice(0, 4).map((c) => (
            <Grid item xs={12} md={3} key={c.symbol} component="div">
              <Card className="crypto-card">
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    {c.name}
                  </Typography>
                  <Typography variant="caption" className="card-subtitle" sx={{ display: "block", mb: 1 }}>
                    {c.symbol}
                  </Typography>
                  <Typography variant="body2" className="card-text">
                    Precio: <strong>{formatUSD(c.priceUsd)}</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 1, color: (c.changePct24h ?? 0) >= 0 ? "#39ff14" : "#ff1744" }}>
                    24h: {(c.changePct24h ?? 0) > 0 ? "+" : ""}{c.changePct24h}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rank #{c.rank}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} justifyContent="center">
          {data.slice(4, 8).map((c) => (
            <Grid item xs={12} md={3} key={c.symbol} component="div">
              <Card className="crypto-card">
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    {c.name}
                  </Typography>
                  <Typography variant="caption" className="card-subtitle" sx={{ display: "block", mb: 1 }}>
                    {c.symbol}
                  </Typography>
                  <Typography variant="body2" className="card-text">
                    Precio: <strong>{formatUSD(c.priceUsd)}</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 1, color: (c.changePct24h ?? 0) >= 0 ? "#39ff14" : "#ff1744" }}>
                    24h: {(c.changePct24h ?? 0) > 0 ? "+" : ""}{c.changePct24h}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rank #{c.rank}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} justifyContent="center">
          {data.slice(8, 10).map((c) => (
            <Grid item xs={12} md={3} key={c.symbol} component="div">
              <Card className="crypto-card">
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    {c.name}
                  </Typography>
                  <Typography variant="caption" className="card-subtitle" sx={{ display: "block", mb: 1 }}>
                    {c.symbol}
                  </Typography>
                  <Typography variant="body2" className="card-text">
                    Precio: <strong>{formatUSD(c.priceUsd)}</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 1, color: (c.changePct24h ?? 0) >= 0 ? "#39ff14" : "#ff1744" }}>
                    24h: {(c.changePct24h ?? 0) > 0 ? "+" : ""}{c.changePct24h}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rank #{c.rank}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
}
