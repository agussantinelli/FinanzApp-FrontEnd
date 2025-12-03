"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTopCryptos } from "@/services/CryptoService";
import { CryptoTopDTO } from "@/types/Crypto";
import {
  Paper, Stack, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

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
      sx={(t) => ({
        bgcolor: t.custom.cardBg,
        border: `1px solid ${t.custom.borderColor}`,
        borderRadius: 3,
        boxShadow: t.custom.shadow,
        transition: "all .3s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: t.custom.shadowHover },
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <CardContent sx={{ flexGrow: 1, minHeight: 110 }}>
        <Typography variant="h6" sx={(t) => ({ color: t.palette.primary.main, fontWeight: 700 })} noWrap title={`${c.name} (${c.symbol})`}>
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
    <Paper sx={(t) => ({
      p: { xs: 2.5, md: 3 },
      bgcolor: t.custom.paperBg,
      border: `1px solid ${t.custom.borderColor}59`,
      borderRadius: 3,
      backdropFilter: "blur(3px)",
    })}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={(t) => ({ fontWeight: 800, color: t.palette.primary.main })}>
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
          sx={(t) => ({ borderColor: t.palette.primary.main, color: t.palette.primary.main, "&:hover": { borderColor: t.palette.primary.main } })}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider sx={(t) => ({ my: 2.5, borderColor: t.custom.divider })} />

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
