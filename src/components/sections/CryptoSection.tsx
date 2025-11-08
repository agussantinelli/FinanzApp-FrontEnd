"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTopCryptos } from "@/services/CryptoService";
import { CryptoTopDTO } from "@/types/Crypto";
import {
  Paper, Stack, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const NEON = "#39ff14";
const PAPER_BG = "rgba(0,255,0,0.03)";
const CARD_BG = "rgba(0,255,0,0.05)";
const BORDER = `1px solid ${NEON}`;
const SHADOW = "0 0 12px rgba(57,255,20,0.25)";
const SHADOW_HOVER = "0 0 18px rgba(57,255,20,0.5)";
const DIVIDER = "rgba(57,255,20,0.25)";

function formatUSD(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function CryptoSection() {
  const [data, setData] = useState<CryptoTopDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getTopCryptos(10);
    setData(res);
    setUpdatedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const firstRow = useMemo(() => data.slice(0, 5), [data]);
  const secondRow = useMemo(() => data.slice(5, 10), [data]);

  const CryptoCard = (c: CryptoTopDTO) => (
    <Card
      sx={{
        bgcolor: CARD_BG,
        border: BORDER,
        borderRadius: 3,
        boxShadow: SHADOW,
        transition: "all .3s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: SHADOW_HOVER },
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1, minHeight: 110 }}>
        <Typography variant="h6" sx={{ color: NEON, fontWeight: 700 }} noWrap title={`${c.name} (${c.symbol})`}>
          {c.name} ({c.symbol})
        </Typography>
        <Typography>
          Precio: <strong>{formatUSD(c.priceUsd)}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Rank #{c.rank} — {c.source}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{
      p: { xs: 2.5, md: 3 },
      bgcolor: PAPER_BG,
      border: `1px solid ${NEON}59`,
      borderRadius: 3,
    }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: NEON }}>
            CriptoMonedas Top 10 por Market Cap
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Precios en USD — fuente: CoinGecko/CoinCap.
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
          color="success"
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
          disabled={loading}
          sx={{ borderColor: NEON, color: NEON, "&:hover": { borderColor: NEON } }}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: DIVIDER }} />

      <Stack spacing={{ xs: 2, md: 3 }}>
        <Grid container spacing={3} alignItems="stretch">
          {firstRow.map((c) => (
            <Grid item xs={12} sm={6} md={3} key={`row1-${c.symbol}`} sx={{ display: "flex" }}>
              {CryptoCard(c)}
            </Grid>
          ))}
        </Grid>

        {secondRow.length > 0 && (
          <Grid container spacing={3} alignItems="stretch">
            {secondRow.map((c) => (
              <Grid item xs={12} sm={6} md={3} key={`row2-${c.symbol}`} sx={{ display: "flex" }}>
                {CryptoCard(c)}
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Paper>
  );
}
