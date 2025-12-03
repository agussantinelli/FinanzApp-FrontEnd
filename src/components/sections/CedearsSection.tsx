"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCedearDuals } from "@/services/CedearsService";
import { getCotizacionesDolar } from "@/services/DolarService";
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
function isCCL(nombreRaw: string) {
  const n = (nombreRaw || "").toLowerCase();
  return n.includes("contado") || n.includes("liqui") || n.includes("liquid") || n.includes("ccl");
}

const COMPANY: Record<string, string> = {
  "AAPL.BA": "Apple", "AMZN.BA": "Amazon", "NVDA.BA": "NVIDIA",
  "MSFT.BA": "Microsoft", "GOOGL.BA": "Alphabet", "META.BA": "Meta",
  "TSLA.BA": "Tesla", "BRKB.BA": "Berkshire Hathaway", "KO.BA": "Coca-Cola Company",
};

export default function CedearsSection() {
  const [data, setData] = useState<DualQuoteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [cclRate, setCclRate] = useState<number | null>(null);

  const fetchCCL = useCallback(async () => {
    const cot = await getCotizacionesDolar();
    const ccl = cot.find(c => isCCL(c.nombre ?? c.nombre));
    setCclRate(ccl?.venta ?? null);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ced] = await Promise.all([getCedearDuals("CCL"), fetchCCL()]);
      setData(ced);
      setUpdatedAt(new Date());
    } catch (e) {
      console.error("❌ Error en CedearsSection:", e);
    } finally {
      setLoading(false);
    }
  }, [fetchCCL]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const symbolsWanted = useMemo(
    () => new Set(["AAPL.BA", "AMZN.BA", "NVDA.BA", "MSFT.BA", "GOOGL.BA", "META.BA", "TSLA.BA", "BRKB.BA", "KO.BA"]),
    []
  );

  const filtered = useMemo(
    () => data.filter(d => symbolsWanted.has((d.localSymbol || "").toUpperCase())),
    [data, symbolsWanted]
  );

  const withDerived = useMemo(() => {
    const rate = (cclRate && cclRate > 0) ? cclRate : undefined;
    return filtered.map(d => {
      const usedRate = rate ?? d.usedDollarRate;
      return { ...d, usedDollarRate: usedRate };
    });
  }, [filtered, cclRate]);

  const rows = useMemo(() => chunk(withDerived, 3), [withDerived]);

  const UnifiedCard = (d: DualQuoteDTO) => {
    const isCedearLocal = d.cedearRatio != null;
    const company = COMPANY[d.localSymbol?.toUpperCase() || ""] ?? d.usSymbol;
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
            {company}
          </Typography>

          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.75 }}>
            {isCedearLocal ? `Precio local = CEDEAR · Ratio ${d.cedearRatio}:1` : "Precio local = Acción BYMA (no CEDEAR)"}
          </Typography>

          <Typography sx={(t) => ({ color: t.palette.primary.main, fontWeight: 700 })}>
            {d.localSymbol} ↔ {d.usSymbol}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            CEDEAR (ARS): <strong>{formatARS(d.localPriceARS)}</strong>
          </Typography>
          <Typography>
            Acción USA (USD): <strong>{formatUSD(d.usPriceUSD)}</strong>
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            Tasa (CCL): {d.usedDollarRate.toLocaleString("es-AR")}
          </Typography>
        </CardContent>
      </Card>
    );
  };

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
            CEDEARs ↔ Acción USA
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

      {withDerived.length === 0 && !loading && (
        <Typography color="text.secondary">No se encontraron cotizaciones.</Typography>
      )}

      <Stack spacing={3}>
        {rows.map((row, idx) => (
          <Grid key={idx} container spacing={3}>
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
