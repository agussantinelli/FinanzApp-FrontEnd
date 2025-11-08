"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStockDuals } from "@/services/StocksService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Stack, Alert, Typography, Button, Card, CardContent,
  CircularProgress, Divider, Grid
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

type PairReq = { localBA: string; usa: string; name: string; cedearRatio?: number | null };

const ENERGETICO: PairReq[] = [
  { localBA: "YPFD.BA", usa: "YPF",  name: "YPF" },
  { localBA: "PAMP.BA", usa: "PAM",  name: "Pampa Energía" },
  { localBA: "VIST.BA", usa: "VIST", name: "Vista Energy" },
];
const BANCARIO: PairReq[] = [
  { localBA: "BMA.BA",  usa: "BMA",  name: "Banco Macro" },
  { localBA: "GGAL.BA", usa: "GGAL", name: "Banco Galicia" },
  { localBA: "SUPV.BA", usa: "SUPV", name: "Banco Supervielle" },
];
const EXTRA: PairReq[] = [
  { localBA: "LOMA.BA", usa: "LOMA", name: "Loma Negra" },
  { localBA: "CEPU.BA", usa: "CEPU", name: "Central Puerto" },
  { localBA: "MELI.BA", usa: "MELI", name: "Mercado Libre", cedearRatio: 2 },
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
  const bancario   = useMemo(() => pick(BANCARIO),   [bySymbol, cclRate]);
  const extra      = useMemo(() => pick(EXTRA),      [bySymbol, cclRate]);

  const rowsEnergetico = useMemo(() => chunk(energetico, 3), [energetico]);
  const rowsBancario   = useMemo(() => chunk(bancario, 3),   [bancario]);
  const rowsExtra      = useMemo(() => chunk(extra, 3),      [extra]);

  const UnifiedCard = (d: DualQuoteDTO & { name?: string }) => {
    const isCedearLocal = d.cedearRatio != null;
    return (
      <Card
        sx={(t) => ({
          bgcolor: t.custom.cardBg,
          border: `1px solid ${t.custom.borderColor}`,
          borderRadius: 3,
          boxShadow: t.custom.shadow,
          transition: "all .3s",
          "&:hover": { transform: "translateY(-5px)", boxShadow: t.custom.shadowHover }
        })}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.25 }}>
            {d.name ?? d.usSymbol}
          </Typography>

          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.75 }}>
            {isCedearLocal ? `Precio local = CEDEAR · Ratio ${d.cedearRatio}:1` : "Precio local = Acción BYMA (no CEDEAR)"}
          </Typography>

          <Typography sx={(t)=>({ color: t.palette.primary.main, fontWeight: 700 })}>
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
  };

  return (
    <Paper sx={(t)=>({
      p: { xs: 2.5, md: 3 },
      bgcolor: t.custom.paperBg,
      border: `1px solid ${t.custom.borderColor}59`,
      borderRadius: 3,
    })}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <div>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" sx={(t)=>({ fontWeight: 800, color: t.palette.primary.main })}>
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
          color="primary"
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
          disabled={loading}
          sx={(t)=>({ borderColor: t.palette.primary.main, color: t.palette.primary.main, "&:hover": { borderColor: t.palette.primary.main } })}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider sx={(t)=>({ my: 2.5, borderColor: t.custom.divider })} />

      <Typography variant="subtitle1" sx={(t)=>({ fontWeight: 700, mb: 1, color: t.palette.primary.main })}>
        Sector Energético
      </Typography>
      <Stack spacing={3}>
        {rowsEnergetico.map((row, idx) => (
          <Grid container spacing={3} key={`en-${idx}`}>
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Divider sx={(t)=>({ my: 2.5, borderColor: t.custom.dividerSoft })} />

      <Typography variant="subtitle1" sx={(t)=>({ fontWeight: 700, mb: 1, color: t.palette.primary.main })}>
        Sector Bancario
      </Typography>
      <Stack spacing={3}>
        {rowsBancario.map((row, idx) => (
          <Grid container spacing={3} key={`ban-${idx}`}>
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>

      <Divider sx={(t)=>({ my: 2.5, borderColor: t.custom.dividerSoft })} />

      <Typography variant="subtitle1" sx={(t)=>({ fontWeight: 700, mb: 1, color: t.palette.primary.main })}>
        Otros
      </Typography>
      <Stack spacing={3}>
        {rowsExtra.map((row, idx) => (
          <Grid container spacing={3} key={`ex-${idx}`}>
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                {UnifiedCard(d)}
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>
    </Paper>
  );
}