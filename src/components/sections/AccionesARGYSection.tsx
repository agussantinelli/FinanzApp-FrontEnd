"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStockDuals } from "@/services/StocksService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Stack, Alert, Typography, Button, Grid, Card, CardContent,
  CircularProgress, Divider
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
function isCCL(nombreRaw: string) {
  const n = (nombreRaw || "").toLowerCase();
  return n.includes("contado") || n.includes("liqui") || n.includes("liquid") || n.includes("ccl");
}

// --- Pares locales/USA por sector ---
const ENERGETICO = [
  { localBA: "YPFD.BA",  usa: "YPF",  name: "YPF" },
  { localBA: "PAMP.BA",  usa: "PAM",  name: "Pampa Energía" },
  { localBA: "VIST.BA",  usa: "VIST", name: "Vista Energy" },
];
const BANCARIO = [
  { localBA: "BMA.BA",  usa: "BMA",  name: "Banco Macro" },
  { localBA: "GGAL.BA", usa: "GGAL", name: "Banco Galicia" },
  { localBA: "SUPV.BA", usa: "SUPV", name: "Banco Supervielle" },
];
// ➜ Agrego MELI como CEDEAR junto a Central Puerto
const EXTRA = [
  { localBA: "CEPU.BA", usa: "CEPU", name: "Central Puerto" },
  { localBA: "MELI.BA", usa: "MELI", name: "Mercado Libre (CEDEAR)" },
];

export default function AccionesARSection() {
  const ALL_PAIRS = useMemo(() => [...ENERGETICO, ...BANCARIO, ...EXTRA], []);
  const [data, setData] = useState<DualQuoteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [cclRate, setCclRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCCL = useCallback(async () => {
    const cot = await getCotizacionesDolar();
    const ccl = cot.find(c => isCCL(c.nombre));
    setCclRate(ccl?.venta ?? null);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [duals] = await Promise.all([
        getStockDuals(ALL_PAIRS, "CCL"),
        fetchCCL(),
      ]);
      setData(duals);
      setUpdatedAt(new Date());
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.title ?? "No se pudo cargar. Reintentá.");
    } finally {
      setLoading(false);
    }
  }, [ALL_PAIRS, fetchCCL]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const bySymbol = useMemo(
    () => new Map(data.map(d => [d.localSymbol.toUpperCase(), d])),
    [data]
  );

  function pick(list: { localBA: string; usa: string; name: string }[]) {
    const arr: (DualQuoteDTO & { name: string })[] = [];
    for (const p of list) {
      const d = bySymbol.get(p.localBA.toUpperCase());
      if (!d) continue;
      const rate = cclRate && cclRate > 0 ? cclRate : d.usedDollarRate;
      arr.push({
        ...d,
        name: p.name,
        usedDollarRate: rate,
        localPriceUSD: +(d.localPriceARS / rate).toFixed(2),
        usPriceARS: +(d.usPriceUSD * rate).toFixed(2),
      });
    }
    return arr;
  }

  const energetico = useMemo(() => pick(ENERGETICO), [bySymbol, cclRate]);
  const bancario   = useMemo(() => pick(BANCARIO),   [bySymbol, cclRate]);
  const extra      = useMemo(() => pick(EXTRA),      [bySymbol, cclRate]);

  const rowsEnergetico = useMemo(() => chunk(energetico, 3), [energetico]);
  const rowsBancario   = useMemo(() => chunk(bancario, 3),   [bancario]);
  const rowsExtra      = useMemo(() => chunk(extra, 3),      [extra]);

  const CardDual = (d: DualQuoteDTO & { name?: string }) => (
    <Card
      sx={{
        bgcolor: "rgba(0,255,0,0.05)",
        border: "1px solid #39ff14",
        borderRadius: 3,
        boxShadow: "0 0 12px rgba(57,255,20,0.25)",
        transition: "all .3s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0 18px rgba(57,255,20,0.5)" }
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          {d.name ?? d.usSymbol}
        </Typography>
        <Typography sx={{ color: "#39ff14", fontWeight: 700 }}>
          {d.localSymbol} ↔ {d.usSymbol}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Local (ARS): <strong>{formatARS(d.localPriceARS)}</strong>
        </Typography>
        <Typography>
          USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Tasa (CCL): {d.usedDollarRate.toLocaleString("es-AR")}
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
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#39ff14" }}>
            Empresas Argentinas ↔ ADR / CEDEARs
          </Typography>
          {updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </div>
        <Button
          onClick={fetchData}
          variant="outlined"
          color="success"
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
          disabled={loading}
          sx={{ borderColor: "#39ff14", color: "#39ff14", "&:hover": { borderColor: "#39ff14" } }}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: "rgba(57,255,20,0.25)" }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#39ff14" }}>
        Sector energético
      </Typography>
      <Stack spacing={3}>
        {rowsEnergetico.map((row, idx) => (
          <Grid container spacing={3} key={`en-${idx}`}>
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

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "#39ff14" }}>
        Otros
      </Typography>
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
    </Paper>
  );
}
