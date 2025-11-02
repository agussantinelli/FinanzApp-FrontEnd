"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCedearDuals } from "@/services/CedearsService";
import { getCotizacionesDolar } from "@/services/DolarService";
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
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function isCCL(nombreRaw: string) {
  const n = (nombreRaw || "").toLowerCase();
  return n.includes("contado") || n.includes("liqui") || n.includes("liquid") || n.includes("ccl");
}

const COMPANY: Record<string, string> = {
  "AAPL.BA": "Apple",
  "AMZN.BA": "Amazon",
  "NVDA.BA": "NVIDIA",
  "MSFT.BA": "Microsoft",
  "GOOGL.BA": "Alphabet",
  "META.BA": "Meta",
  "TSLA.BA": "Tesla",
  "BRKB.BA": "Berkshire Hathaway",
  "KO.BA": "Coca-Cola Company",
};

export default function CedearsSection() {
  const [data, setData] = useState<DualQuoteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [cclRate, setCclRate] = useState<number | null>(null);

  const fetchCCL = useCallback(async () => {
    const cot = await getCotizacionesDolar();
    const ccl = cot.find(c => isCCL(c.nombre ?? c.nombre)); // compat con back/front
    setCclRate(ccl?.venta ?? ccl?.venta ?? null);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [ced, _] = await Promise.all([
      getCedearDuals("CCL"),
      fetchCCL()
    ]);
    setData(ced);
    setUpdatedAt(new Date());
    setLoading(false);
  }, [fetchCCL]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const symbolsWanted = useMemo(
    () => new Set(["AAPL.BA","AMZN.BA","NVDA.BA","MSFT.BA","GOOGL.BA","META.BA","TSLA.BA","BRKB.BA","KO.BA"]),
    []
  );

  const filtered = useMemo(
    () => data.filter(d => symbolsWanted.has(d.localSymbol.toUpperCase())),
    [data, symbolsWanted]
  );

  const withUnifiedRate = useMemo(() => {
    if (!cclRate || cclRate <= 0) return filtered;
    return filtered.map(d => ({
      ...d,
      usedDollarRate: cclRate,
      localPriceUSD: +(d.localPriceARS / cclRate).toFixed(2),
      usPriceARS: +(d.usPriceUSD * cclRate).toFixed(2),
      theoreticalCedearARS: d.cedearRatio
        ? +((d.usPriceUSD * cclRate) / d.cedearRatio).toFixed(2)
        : d.theoreticalCedearARS
    }));
  }, [filtered, cclRate]);

  const rows = useMemo(() => chunk(withUnifiedRate, 3), [withUnifiedRate]);

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
            CEDEARs ↔ Acción USA
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

      {withUnifiedRate.length === 0 && !loading && (
        <Typography color="text.secondary">No se encontraron cotizaciones.</Typography>
      )}

      <Stack spacing={3}>
        {rows.map((row, idx) => (
          <Grid key={idx} container spacing={3}>
            {row.map(d => (
              <Grid item xs={12} md={4} key={d.localSymbol}>
                <Card sx={{
                  bgcolor: "rgba(0,255,0,0.05)",
                  border: "1px solid #39ff14",
                  borderRadius: 3,
                  boxShadow: "0 0 12px rgba(57,255,20,0.25)",
                  transition: "all .3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0 18px rgba(57,255,20,0.5)" }
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {COMPANY[d.localSymbol.toUpperCase()] ?? d.usSymbol}
                    </Typography>
                    <Typography sx={{ color: "#39ff14", fontWeight: 700 }}>
                      {d.localSymbol} ↔ {d.usSymbol}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      CEDEAR (ARS): <strong>{formatARS(d.localPriceARS)}</strong>
                    </Typography>
                    <Typography>
                      Acción USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                      {d.cedearRatio ? `Ratio: ${d.cedearRatio} | ` : ""}
                      Tasa (CCL): { (cclRate ?? d.usedDollarRate).toLocaleString("es-AR") }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>
    </Paper>
  );
}
