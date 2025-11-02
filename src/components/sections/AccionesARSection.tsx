"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStockDuals } from "@/services/StocksService";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Stack, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function formatARS(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
}
function formatUSD(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ---- PARES SOLICITADOS ----
// Sector petrolero: YPF, Pampa, Vista
const ENERGETICO = [
  { localBA: "YPFD.BA",  usa: "YPF"  }, // YPF (ADR YPF)
  { localBA: "PAMP.BA",  usa: "PAM"  }, // Pampa Energía (ADR PAM)
  { localBA: "VISTA.BA", usa: "VIST" }, // Vista (ADR VIST)
];

// Sector bancario: Macro, Galicia, Supervielle
const BANCARIO = [
  { localBA: "BMA.BA",  usa: "BMA"  },
  { localBA: "GGAL.BA", usa: "GGAL" },
  { localBA: "SUPV.BA", usa: "SUPV" },
];

// Adicionales: Central Puerto (sí tiene ADR CEPU) + Mercado Libre (según tu nota: “sin CEDEAR”)
const EXTRA = [
  { localBA: "CEPU.BA", usa: "CEPU" }, // Central Puerto
  // Mercado Libre: no lo incluimos en pares (no hay acción local); lo mostramos aparte.
];

export default function AccionesARSection() {
  const [data, setData] = useState<DualQuoteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const ALL_PAIRS = useMemo(() => [...ENERGETICO, ...BANCARIO, ...EXTRA], []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getStockDuals(ALL_PAIRS, "CCL");
    setData(res);
    setUpdatedAt(new Date());
    setLoading(false);
  }, [ALL_PAIRS]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  // Helpers para filtrar por sector
  const bySymbols = useMemo(() => new Map(data.map(d => [d.localSymbol.toUpperCase(), d])), [data]);

  const energetico = useMemo(() =>
    ENERGETICO.map(p => bySymbols.get(p.localBA.toUpperCase())).filter(Boolean) as DualQuoteDTO[],
  [bySymbols]);

  const bancario = useMemo(() =>
    BANCARIO.map(p => bySymbols.get(p.localBA.toUpperCase())).filter(Boolean) as DualQuoteDTO[],
  [bySymbols]);

  const extra = useMemo(() =>
    EXTRA.map(p => bySymbols.get(p.localBA.toUpperCase())).filter(Boolean) as DualQuoteDTO[],
  [bySymbols]);

  const rowsPetrolero = useMemo(() => chunk(energetico, 3), [energetico]);
  const rowsBancario  = useMemo(() => chunk(bancario, 3),  [bancario]);
  const rowsExtra     = useMemo(() => chunk(extra, 3),     [extra]);

  const CardDual = (d: DualQuoteDTO) => (
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
          {d.localSymbol} ↔ {d.usSymbol}
        </Typography>

        <Typography>Local (ARS): <strong>{formatARS(d.localPriceARS)}</strong></Typography>
        <Typography>Local en USD (con {d.dollarRateName}): <strong>{formatUSD(d.localPriceUSD)}</strong></Typography>

        <Typography>USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong></Typography>
        <Typography>USA en ARS (con {d.dollarRateName}): <strong>{formatARS(d.usPriceARS)}</strong></Typography>

        <Typography variant="caption" color="text.secondary">
          Tasa usada: {d.dollarRateName} = {d.usedDollarRate.toLocaleString("es-AR")}
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
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#39ff14" }}>
            Empresas Argentinas ↔ ADR en USA
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

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#39ff14" }}>
        Sector Energetico
      </Typography>
      <Stack spacing={3}>
        {rowsPetrolero.map((row, idx) => (
          <Grid container spacing={3} key={`pet-${idx}`}>
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {CardDual(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: "rgba(57,255,20,0.15)" }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#39ff14" }}>
        Sector bancario
      </Typography>
      <Stack spacing={3}>
        {rowsBancario.map((row, idx) => (
          <Grid container spacing={3} key={`ban-${idx}`}>
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {CardDual(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: "rgba(57,255,20,0.15)" }} />

      <Stack spacing={3}>
        {rowsExtra.map((row, idx) => (
          <Grid container spacing={3} key={`ex-${idx}`}>
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {CardDual(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Card sx={{
          bgcolor: "rgba(0,255,0,0.03)",
          border: "1px dashed #39ff14",
          borderRadius: 3,
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Mercado Libre (MELI)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Según tu nota: “no tiene CEDEAR”. Se muestra como referencia fuera de los pares locales.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Paper>
  );
}
