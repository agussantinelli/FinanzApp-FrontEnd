"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DolarDTO } from "@/types/Dolar";
import {
  Paper, Box, Stack, Typography, Divider, Button, Grid, Card,
  CardContent, CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Link from "next/link";
import BarChartIcon from "@mui/icons-material/BarChart";

function formatARS(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 1 });
}

function titleCase(s: string) {
  return s.trim().replace(/\s+/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function normalizeName(nombreRaw?: string | null) {
  if (!nombreRaw) return "";
  const n = nombreRaw.trim().toLowerCase();
  if (n.includes("contado con liqui") || n.includes("contado") || n.includes("liqui") || n.includes("liquid")) return "CCL";
  if (n.includes("bolsa") || n.includes("mep")) return "MEP";
  if (n.includes("oficial")) return "Oficial";
  if (n.includes("blue") || n.includes("informal")) return "Blue";
  if (n.includes("tarjeta") || n.includes("qatar") || n.includes("solidario") || n.includes("turista") || n.includes("card")) return "Tarjeta";
  if (n.includes("mayorista")) return "Mayorista";
  if (n.includes("cripto") || n.includes("crypto")) return "Cripto";
  return titleCase(nombreRaw);
}

export default function DolarSection() {
  const [data, setData] = useState<DolarDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getCotizacionesDolar();
    setData(res ?? []);
    setUpdatedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const uniqueData = useMemo(() => {
    const seen = new Set<string>();
    const out: DolarDTO[] = [];
    for (const c of data ?? []) {
      const n = normalizeName(c?.nombre);
      if (!n || n === "—") continue;
      if (seen.has(n)) continue;
      seen.add(n);
      out.push({ ...c, nombre: n });
    }
    return out;
  }, [data]);

  const firstRow  = useMemo(() => uniqueData.slice(0, 4), [uniqueData]);
  const secondRow = useMemo(() => uniqueData.slice(4),     [uniqueData]);

  return (
    <Paper sx={(t)=>({
      p: { xs: 2.5, md: 3 },
      bgcolor: t.custom.paperBg,
      border: `1px solid ${t.custom.borderColor}59`,
      borderRadius: 3,
      backdropFilter: "blur(3px)",
    })}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={(t)=>({ fontWeight: 800, color: t.palette.primary.main })}>
            Cotizaciones del dólar
          </Typography>
          {updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            component={Link}
            href="/reportes/dolar"
            variant="contained"
            color="primary"
            startIcon={<BarChartIcon />}
            sx={(t)=>({ bgcolor: t.palette.primary.main, color: "#000", "&:hover": { bgcolor: t.palette.primary.main } })}
          >
            Ver gráfico
          </Button>

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
      </Stack>

      <Divider sx={(t)=>({ my: 2.5, borderColor: t.custom.divider })} />

      <Stack spacing={{ xs: 2, md: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {firstRow.map((c, i) => {
            const label = normalizeName(c?.nombre) || "—";
            return (
              <Grid item xs={12} sm={6} md={3} key={`row1-${i}`} component="div">
                <Card
                  sx={(t)=>({
                    bgcolor: t.custom.cardBg,
                    border: `1px solid ${t.custom.borderColor}`,
                    borderRadius: 3,
                    textAlign: "center",
                    boxShadow: t.custom.shadow,
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: t.custom.shadowHover },
                  })}
                >
                  <CardContent>
                    <Typography variant="h6" sx={(t)=>({ color: t.palette.primary.main, fontWeight: 700, mb: 0.5 })}>
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      Compra: <strong>{formatARS(c?.compra)}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#fff" }}>
                      Venta: <strong>{formatARS(c?.venta)}</strong>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {secondRow.length > 0 && (
          <Grid container spacing={3} justifyContent="center">
            {secondRow.map((c, i) => {
              const label = normalizeName(c?.nombre) || "—";
              return (
                <Grid item xs={12} sm={6} md={3} key={`row2-${i}`} component="div">
                  <Card
                    sx={(t)=>({
                      bgcolor: t.custom.cardBg,
                      border: `1px solid ${t.custom.borderColor}`,
                      borderRadius: 3,
                      textAlign: "center",
                      boxShadow: t.custom.shadow,
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: t.custom.shadowHover },
                    })}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={(t)=>({ color: t.palette.primary.main, fontWeight: 700, mb: 0.5 })}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        Compra: <strong>{formatARS(c?.compra)}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff" }}>
                        Venta: <strong>{formatARS(c?.venta)}</strong>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Stack>
    </Paper>
  );
}
