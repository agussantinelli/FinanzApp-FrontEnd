"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStockDuals } from "@/services/StocksService";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DualQuoteDTO } from "@/types/Market";
import {
  Paper, Stack, Alert, Typography, Button, Card, CardContent,
  CircularProgress, Divider
} from "@mui/material";
import Grid from "@mui/material/Grid";
import RefreshIcon from "@mui/icons-material/Refresh";

const NEON = "#39ff14";
const PAPER_BG = "rgba(0,255,0,0.03)";
const CARD_BG = "rgba(0,255,0,0.05)";
const BORDER = `1px solid ${NEON}`;
const SHADOW = "0 0 12px rgba(57,255,20,0.25)";
const SHADOW_HOVER = "0 0 18px rgba(57,255,20,0.5)";
const DIVIDER = "rgba(57,255,20,0.25)";
const DIVIDER_SOFT = "rgba(57,255,20,0.15)";

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

// Pares locales/USA por sector
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

// “Otros” mezcla locales y CEDEARs (ej. MELI es CEDEAR).
// ⚠️ Ratio de ejemplo para MELI = 2 (ajustá si tu catálogo difiere).
const EXTRA: PairReq[] = [
  { localBA: "LOMA.BA", usa: "LOMA", name: "Loma Negra" },                  // Acción local
  { localBA: "CEPU.BA", usa: "CEPU", name: "Central Puerto" },              // Acción local
  { localBA: "MELI.BA", usa: "MELI", name: "Mercado Libre (CEDEAR)", cedearRatio: 2 }, // CEDEAR
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
      const [duals] = await Promise.all([
        getStockDuals(pairsForApi as any, "CCL"),
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

  function pick(list: PairReq[]) {
    const arr: (DualQuoteDTO & { name: string })[] = [];
    for (const p of list) {
      const d = bySymbol.get(p.localBA.toUpperCase());
      if (!d) continue;

      // Si el backend no envía ratio pero el par lo trae, lo completamos
      const ratio = d.cedearRatio ?? p.cedearRatio ?? null;

      const rate = cclRate && cclRate > 0 ? cclRate : d.usedDollarRate;
      arr.push({
        ...d,
        name: p.name,
        cedearRatio: ratio,
        usedDollarRate: rate,
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

  const UnifiedCard = (d: DualQuoteDTO & { name?: string }) => {
    const isCedearLocal = d.cedearRatio != null;
    return (
      <Card
        sx={{
          bgcolor: CARD_BG,
          border: BORDER,
          borderRadius: 3,
          boxShadow: SHADOW,
          transition: "all .3s",
          "&:hover": { transform: "translateY(-5px)", boxShadow: SHADOW_HOVER }
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.25 }}>
            {d.name ?? d.usSymbol}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.75 }}>
            {isCedearLocal
              ? `Precio local = CEDEAR · Ratio ${d.cedearRatio}:1`
              : "Precio local = Acción BYMA (no CEDEAR)"}
          </Typography>

          <Typography sx={{ color: NEON, fontWeight: 700 }}>
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
    <Paper sx={{
      p: { xs: 2.5, md: 3 },
      bgcolor: PAPER_BG,
      border: `1px solid ${NEON}59`,
      borderRadius: 3,
    }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <div>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="h5" sx={{ fontWeight: 800, color: NEON }}>
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
          sx={{ borderColor: NEON, color: NEON, "&:hover": { borderColor: NEON } }}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: DIVIDER }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: NEON }}>
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

      <Divider sx={{ my: 2.5, borderColor: DIVIDER_SOFT }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: NEON }}>
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

      <Divider sx={{ my: 2.5, borderColor: DIVIDER_SOFT }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: NEON }}>
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
