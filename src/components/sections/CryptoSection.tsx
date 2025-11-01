"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTopCryptos } from "@/services/CryptoService";
import { CryptoTopDTO } from "@/types/Crypto";

import {
  Paper, Stack, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider
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

  const CardCrypto = (c: CryptoTopDTO) => (
    <Card sx={{
      bgcolor: "rgba(0,255,0,0.05)",
      border: "1px solid #39ff14",
      borderRadius: 3,
      boxShadow: "0 0 12px rgba(57,255,20,0.25)",
      transition: "all .3s",
      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0 18px rgba(57,255,20,0.5)" }
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "#39ff14", fontWeight: 700 }}>
          {c.name} ({c.symbol})
        </Typography>
        <Typography>Precio: <strong>{formatUSD(c.priceUsd)}</strong></Typography>
        <Typography variant="caption" color="text.secondary">
          Rank #{c.rank} — {c.source}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{
      p: { xs: 2.5, md: 3 },
      bgcolor: "rgba(0,255,0,0.03)",
      border: "1px solid rgba(57,255,20,0.35)",
      borderRadius: 3,
    }}>
      <Stack spacing={{ xs: 2, md: 3 }}>
        <Grid container spacing={3} alignItems="stretch">
          {firstRow.map(c => (
            <Grid item xs={12} sm={6} md={3} key={`row1-${c.symbol}`} sx={{ display: "flex" }}>
              <Card
                sx={{
                  bgcolor: "rgba(0,255,0,0.05)",
                  border: "1px solid #39ff14",
                  borderRadius: 3,
                  boxShadow: "0 0 12px rgba(57,255,20,0.25)",
                  transition: "all .3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0 18px rgba(57,255,20,0.5)" },
                  height: "100%",            
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: "#39ff14", fontWeight: 700 }}>
                    {c.name} ({c.symbol})
                  </Typography>
                  <Typography>Precio: <strong>{formatUSD(c.priceUsd)}</strong></Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rank #{c.rank} — {c.source}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {secondRow.length > 0 && (
          <Grid container spacing={3} alignItems="stretch">
            {secondRow.map(c => (
              <Grid item xs={12} sm={6} md={3} key={`row2-${c.symbol}`} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    bgcolor: "rgba(0,255,0,0.05)",
                    border: "1px solid #39ff14",
                    borderRadius: 3,
                    boxShadow: "0 0 12px rgba(57,255,20,0.25)",
                    transition: "all .3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0 18px rgba(57,255,20,0.5)" },
                    height: "100%",        
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ color: "#39ff14", fontWeight: 700 }}>
                      {c.name} ({c.symbol})
                    </Typography>
                    <Typography>Precio: <strong>{formatUSD(c.priceUsd)}</strong></Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rank #{c.rank} — {c.source}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Paper>
  );
}
