"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CircularProgress, Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getCotizacionesDolar } from "@/services/DolarService"; 
import type { DolarDTO } from "@/types/Dolar"; 

type DatoDolar = Pick<DolarDTO, "nombre" | "venta" | "compra"> & { fuente?: string };

export default function DolarBarChart() {
  const [data, setData] = useState<DatoDolar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = (await getCotizacionesDolar()) as DatoDolar[];
        // Orden opcional: destacar tipos más comunes
        const prioridad = ["Oficial", "MEP", "CCL", "Blue"];
        const ordered = [...res].sort((a, b) => {
          const ia = prioridad.indexOf(normalize(a.nombre));
          const ib = prioridad.indexOf(normalize(b.nombre));
          return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        });
        setData(ordered);
        setUpdatedAt(new Date());
      } catch (e: any) {
        setError(e?.message ?? "No se pudieron obtener las cotizaciones");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chart = useMemo(() => {
    const labels = data.map((d) => shortName(d.nombre));
    const ventas = data.map((d) => d.venta ?? 0);
    const compras = data.map((d) => d.compra ?? 0);

    return {
      data: {
        labels,
        datasets: [
          {
            label: "Venta",
            data: ventas,
            borderWidth: 1,
          },
          {
            label: "Compra",
            data: compras,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false as const,
        plugins: {
          legend: { position: "top" as const },
          title: { display: false, text: "" },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (v: any) =>
                Number(v).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }),
            },
          },
        },
      },
    };
  }, [data]);

  if (loading) {
    return (
      <Card sx={{ height: 420 }}>
        <CardHeader title="Cotizaciones de Dólar (ARS)" subheader="Cargando…" />
        <CardContent sx={{ height: 340, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: 420 }}>
        <CardHeader title="Cotizaciones de Dólar (ARS)" subheader="Error" />
        <CardContent sx={{ height: 340, display: "grid", placeItems: "center" }}>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: 420 }}>
      <CardHeader
        title="Cotizaciones de Dólar (ARS)"
        subheader={updatedAt ? `Actualizado: ${updatedAt.toLocaleString("es-AR")}` : undefined}
      />
      <CardContent sx={{ height: 340 }}>
        <Box sx={{ height: "100%" }}>
          <Bar data={chart.data} options={chart.options} />
        </Box>
      </CardContent>
    </Card>
  );
}

function normalize(nombre: string) {
  const n = nombre.toLowerCase();
  if (n.includes("ccl") || n.includes("contado con liqui")) return "CCL";
  if (n.includes("mep")) return "MEP";
  if (n.includes("oficial")) return "Oficial";
  if (n.includes("blue") || n.includes("informal")) return "Blue";
  return nombre;
}
function shortName(nombre: string) {
  const n = normalize(nombre);
  return n.length > 16 ? n.slice(0, 16) + "…" : n;
}
