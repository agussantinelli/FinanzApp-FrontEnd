"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DolarDTO } from "@/types/Dolar";
import {
  Paper, Box, Stack, Typography, Divider, Button, Grid, Card,
  CardContent, CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function formatARS(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 1 });
}

function normalizeName(nombreRaw: string) {
  const n = nombreRaw.trim().toLowerCase();
  if (n.includes("contado") || n.includes("liqui") || n.includes("liquid")) return "CCL";
  if (n.includes("mep")) return "MEP";
  if (n.includes("oficial")) return "Oficial";
  if (n.includes("blue")) return "Blue";
  if (n.includes("cripto") || n.includes("crypto")) return "Cripto";
  return nombreRaw;
}

export default function DolarSection() {
  const [data, setData] = useState<DolarDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await getCotizacionesDolar();
    setData(res);
    setUpdatedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 300_000); // 5 min
    return () => clearInterval(id);
  }, [fetchData]);

  const firstRow = useMemo(() => data.slice(0, 4), [data]);
  const secondRow = useMemo(() => data.slice(4), [data]);

  return (
    <Paper sx={{
      p: { xs: 2.5, md: 3 },
      bgcolor: "rgba(0,255,0,0.03)",
      border: "1px solid rgba(57,255,20,0.35)",
      borderRadius: 3,
      backdropFilter: "blur(3px)",
    }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#39ff14" }}>
            Cotizaciones del dólar
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
          color="success"
          startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
          disabled={loading}
          sx={{ borderColor: "#39ff14", color: "#39ff14", "&:hover": { borderColor: "#39ff14" } }}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: "rgba(57,255,20,0.25)" }} />

      {/* ✅ Dos filas separadas con spacing */}
      <Stack spacing={{ xs: 2, md: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {firstRow.map((c) => {
            const normalized = normalizeName(c.nombre);
            return (
              <Grid item xs={12} sm={6} md={3} key={`row1-${c.nombre}`} component="div">
                <Card
                  sx={{
                    bgcolor: "rgba(0,255,0,0.05)",
                    border: "1px solid #39ff14",
                    borderRadius: 3,
                    textAlign: "center",
                    boxShadow: "0 0 12px rgba(57,255,20,0.25)",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0 18px rgba(57,255,20,0.5)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: "#39ff14", fontWeight: 700, mb: 0.5 }}>
                      {normalized}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Compra: <strong>{formatARS(c.compra)}</strong>
                    </Typography>
                    <Typography variant="body2" color="white">
                      Venta: <strong>{formatARS(c.venta)}</strong>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {secondRow.length > 0 && (
          <Grid container spacing={3} justifyContent="center">
            {secondRow.map((c) => {
              const normalized = normalizeName(c.nombre);
              return (
                <Grid item xs={12} sm={6} md={3} key={`row2-${c.nombre}`} component="div">
                  <Card
                    sx={{
                      bgcolor: "rgba(0,255,0,0.05)",
                      border: "1px solid #39ff14",
                      borderRadius: 3,
                      textAlign: "center",
                      boxShadow: "0 0 12px rgba(57,255,20,0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 0 18px rgba(57,255,20,0.5)" },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#39ff14", fontWeight: 700, mb: 0.5 }}>
                        {normalized}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Compra: <strong>{formatARS(c.compra)}</strong>
                      </Typography>
                      <Typography variant="body2" color="white">
                        Venta: <strong>{formatARS(c.venta)}</strong>
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
