"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, Box, Typography, Stack, Chip, Skeleton } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getCotizacionesDolar } from "@/services/DolarService";
import type { DolarDTO } from "@/types/Dolar";
import styles from "./styles/DolarBarChart.module.css";

type DatoDolar = Pick<DolarDTO, "nombre" | "venta" | "compra">;

const ARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default function DolarBarChart() {
  const [data, setData] = useState<DatoDolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = (await getCotizacionesDolar()) as DatoDolar[];
        setData(res);
        setUpdatedAt(new Date());
      } catch (e: any) {
        setError(e?.message ?? "No se pudieron obtener las cotizaciones");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { chart, kpis } = useMemo(() => {
    const labels = data.map((d) => shortName(d.nombre));
    const ventas = data.map((d) => d.venta ?? 0);
    const compras = data.map((d) => d.compra ?? 0);

    const maxVenta = Math.max(...ventas.filter((v) => Number.isFinite(v)));
    const minVenta = Math.min(...ventas.filter((v) => Number.isFinite(v)));
    const avgVenta =
      ventas.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0) / (ventas.length || 1);

    const chart = {
      data: {
        labels,
        datasets: [
          {
            label: "Venta",
            data: ventas,
            backgroundColor: "#39ff14",
            borderRadius: 8,
            barThickness: 28,
          },
          {
            label: "Compra",
            data: compras,
            backgroundColor: "rgba(255,255,255,0.28)",
            borderRadius: 8,
            barThickness: 28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false as const,
        plugins: {
          legend: { position: "top" as const, labels: { boxWidth: 14 } },
          tooltip: {
            callbacks: {
              label: (ctx: any) => `${ctx.dataset.label}: ${ARS(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxRotation: 0, autoSkip: true },
          },
          y: {
            beginAtZero: false,
            grid: { color: "rgba(255,255,255,0.08)" },
            ticks: {
              callback: (v: any) => ARS(Number(v)),
            },
          },
        },
      },
    };

    return {
      chart,
      kpis: {
        maxVenta,
        minVenta,
        avgVenta,
      },
    };
  }, [data]);

  if (loading) {
    return (
      <Card className={styles.card}>
        <CardHeader title="Cotizaciones de Dólar (ARS)" subheader="Cargando…" />
        <CardContent>
          <Skeleton variant="rounded" height={36} className={styles.loadingSkeleton} />
          <Skeleton variant="rounded" height={320} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.errorCard}>
        <Typography color="error">{error}</Typography>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <CardHeader
        title="Cotizaciones de Dólar (ARS)"
        subheader={updatedAt ? `Actualizado: ${updatedAt.toLocaleString("es-AR")}` : undefined}
      />

      <Box className={styles.cardHeaderWrapper}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip size="small" label={`Máximo venta: ${ARS(kpis.maxVenta || 0)}`} />
          <Chip size="small" label={`Mínimo venta: ${ARS(kpis.minVenta || 0)}`} />
          <Chip size="small" label={`Promedio venta: ${ARS(kpis.avgVenta || 0)}`} />
        </Stack>
      </Box>

      <CardContent className={styles.kpiCardContent}>
        <Box className={styles.chartContainer}>
          <Bar data={chart.data as any} options={chart.options as any} />
        </Box>
      </CardContent>
    </Card>
  );
}

function shortName(nombre: string) {
  const n = nombre.trim();
  return n.length > 18 ? n.slice(0, 18) + "…" : n;
}
