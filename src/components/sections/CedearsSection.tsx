"use client";

import { useCallback, useEffect, useState } from "react";
import { getCedearDuals } from "@/services/CedearsService";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Stack, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function formatARS(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
}
function formatUSD(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default function CedearsSection() {
  const [data, setData] = useState<DualQuoteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getCedearDuals("CCL");
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
    <Paper sx={{
      p: { xs: 2.5, md: 3 },
      bgcolor: "rgba(0,255,0,0.03)",
      border: "1px solid rgba(57,255,20,0.35)",
      borderRadius: 3,
    }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#39ff14" }}>
            CEDEARs ↔ Acción USA (con ratio y paridad)
          </Typography>
          {updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </div>
        <Button onClick={fetchData} variant="outlined" color="success"
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
          disabled={loading}
          sx={{ borderColor: "#39ff14", color: "#39ff14", "&:hover": { borderColor: "#39ff14" } }}>
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: "rgba(57,255,20,0.25)" }} />

      <Grid container spacing={3}>
        {data.map(d => (
          <Grid item xs={12} md={6} key={d.localSymbol}>
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
                  {d.localSymbol} (ratio {d.cedearRatio ?? "?"}) ↔ {d.usSymbol}
                </Typography>

                <Typography>CEDEAR (ARS): <strong>{formatARS(d.localPriceARS)}</strong></Typography>
                <Typography>Acción USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong></Typography>

                {d.theoreticalCedearARS != null && (
                  <Typography>Paridad teórica (USD×{d.dollarRateName}/ratio): <strong>{formatARS(d.theoreticalCedearARS!)}</strong></Typography>
                )}

                <Typography variant="caption" color="text.secondary">
                  Tasa usada: {d.dollarRateName} = {d.usedDollarRate.toLocaleString("es-AR")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
