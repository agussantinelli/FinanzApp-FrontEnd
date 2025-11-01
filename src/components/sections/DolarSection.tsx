"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DolarDTO } from "@/types/Dolar";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";

function formatMoney(n: number) {
  try {
    return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 1 });
  } catch {
    return `$${n}`;
  }
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
  }, [fetchData]);

  const firstRow = useMemo(() => data.slice(0, 4), [data]);
  const secondRow = useMemo(() => data.slice(4), [data]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        bgcolor: "rgba(0,255,0,0.03)",
        border: "1px solid rgba(57,255,20,0.35)",
        borderRadius: 3,
        backdropFilter: "blur(3px)",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#39ff14" }}>
            Cotizaciones del dólar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tipos: Oficial, Blue, MEP/Bolsa, CCL, Mayorista, Cripto, Tarjeta, etc.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          {updatedAt && (
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
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
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: "rgba(57,255,20,0.25)" }} />

      <Grid container spacing={3} justifyContent="center" sx={{ mb: secondRow.length ? 1 : 0 }}>
        {firstRow.map((c) => (
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
                  {c.nombre}
                </Typography>
                <Typography variant="body2" color="white">
                  Compra: <strong>{formatMoney(c.compra)}</strong>
                </Typography>
                <Typography variant="body2" color="white">
                  Venta: <strong>{formatMoney(c.venta)}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {secondRow.length > 0 && (
        <Grid container spacing={3} justifyContent="center">
          {secondRow.map((c) => (
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
                    {c.nombre}
                  </Typography>
                  <Typography variant="body2" color="white">
                    Compra: <strong>{formatMoney(c.compra)}</strong>
                  </Typography>
                  <Typography variant="body2" color="white">
                    Venta: <strong>{formatMoney(c.venta)}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
