"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStockDuals } from "@/services/StocksService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Stack, Alert, Typography, Button, Card, CardContent,
  CircularProgress, Divider, Grid, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import "./styles/AccionesARGYSection.css";

function isCCL(nombreRaw: string) {
  const n = (nombreRaw || "").toLowerCase();
  return n.includes("contado") || n.includes("liqui") || n.includes("liquid") || n.includes("ccl");
}

type PairReq = { localBA: string; usa: string; name: string; cedearRatio?: number | null };

const ENERGETICO: PairReq[] = [
  { localBA: "YPFD.BA", usa: "YPF", name: "YPF" },
  { localBA: "PAMP.BA", usa: "PAM", name: "Pampa Energía" },
  { localBA: "VIST.BA", usa: "VIST", name: "Vista Energy" },
];
const BANCARIO: PairReq[] = [
  { localBA: "BMA.BA", usa: "BMA", name: "Banco Macro" },
  { localBA: "GGAL.BA", usa: "GGAL", name: "Banco Galicia" },
  { localBA: "SUPV.BA", usa: "SUPV", name: "Banco Supervielle" },
];
const EXTRA: PairReq[] = [
  { localBA: "LOMA.BA", usa: "LOMA", name: "Loma Negra" },
  { localBA: "CEPU.BA", usa: "CEPU", name: "Central Puerto" },
  { localBA: "MELI.BA", usa: "MELI", name: "Mercado Libre", cedearRatio: 2 },
];

function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function formatARS(val: number) {
  return val.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function formatUSD(val: number | null | undefined) {
  if (val === undefined || val === null || isNaN(val)) return "N/A";
  return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

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
      const pairsForApi = ALL_PAIRS.map(p => ({
        localBA: p.localBA,
        usa: p.usa,
        cedearRatio: p.cedearRatio ?? null,
      }));
      const [duals] = await Promise.all([getStockDuals(pairsForApi as any, "CCL"), fetchCCL()]);
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

  const bySymbol = useMemo(() => new Map(data.map(d => [d.localSymbol.toUpperCase(), d])), [data]);

  function pick(list: PairReq[]) {
    const arr: (DualQuoteDTO & { name: string })[] = [];
    for (const p of list) {
      const d = bySymbol.get(p.localBA.toUpperCase());
      if (!d) continue;
      const ratio = d.cedearRatio ?? p.cedearRatio ?? null;
      const rate = cclRate && cclRate > 0 ? cclRate : d.usedDollarRate;
      arr.push({ ...d, name: p.name, cedearRatio: ratio, usedDollarRate: rate });
    }
    return arr;
  }

  const energetico = useMemo(() => pick(ENERGETICO), [bySymbol, cclRate]);
  const bancario = useMemo(() => pick(BANCARIO), [bySymbol, cclRate]);
  const extra = useMemo(() => pick(EXTRA), [bySymbol, cclRate]);

  const rowsEnergetico = useMemo(() => chunk(energetico, 3), [energetico]);
  const rowsBancario = useMemo(() => chunk(bancario, 3), [bancario]);
  const rowsExtra = useMemo(() => chunk(extra, 3), [extra]);

  const UnifiedCard = (d: DualQuoteDTO & { name?: string }) => {
    const isCedearLocal = d.cedearRatio != null;
    return (
      <Card className="acciones-card">
        <CardContent>
          <Typography variant="h6" className="card-title">
            {d.name ?? d.usSymbol}
          </Typography>

          <Typography variant="caption" className="card-subtitle">
            {isCedearLocal ? `Precio local = CEDEAR · Ratio ${d.cedearRatio}:1` : "Precio local = Acción BYMA (no CEDEAR)"}
          </Typography>

          <Typography className="card-symbol">
            {d.localSymbol} ↔ {d.usSymbol}
          </Typography>

          <Typography className="card-text">
            Local (ARS): <strong>{formatARS(d.localPriceARS)}</strong>
          </Typography>
          <Typography>
            USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong>
          </Typography>

          <Typography variant="caption" color="text.secondary" className="card-rate">
            Tasa (CCL): {d.usedDollarRate.toLocaleString("es-AR")}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper className="section-paper">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" className="header-title">
            Empresas Argentinas ↔ ADR / CEDEARs
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
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider className="section-divider" />

      <Typography variant="subtitle1" className="section-subtitle">
        Sector Energético
      </Typography>
      <Stack spacing={3}>
        {rowsEnergetico.map((row, idx) => (
          <Grid container spacing={3} key={`en-${idx}`} justifyContent="center">
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Divider className="section-divider-soft" />

      <Typography variant="subtitle1" className="section-subtitle">
        Sector Bancario
      </Typography>
      <Stack spacing={3}>
        {rowsBancario.map((row, idx) => (
          <Grid container spacing={3} key={`ban-${idx}`} justifyContent="center">
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Divider className="section-divider-soft" />

      <Typography variant="subtitle1" className="section-subtitle">
        Otros
      </Typography>
      <Stack spacing={3}>
        {rowsExtra.map((row, idx) => (
          <Grid container spacing={3} key={`ex-${idx}`} justifyContent="center">
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>
    </Paper >
  );
}