"use client";

import { useEffect, useState } from "react";
import { getCotizacionesDolar } from "@/services/DolarService";
import { DolarDTO } from "@/types/Dolar";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
 
export default function HomePage() {
  const [cotizaciones, setCotizaciones] = useState<DolarDTO[]>([]);

  useEffect(() => {
    getCotizacionesDolar().then(setCotizaciones);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Encabezado */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Controlá tus finanzas con{" "}
          <span style={{ color: "#39ff14" }}>FinanzApp</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Registrá movimientos, organizá categorías y obtené reportes claros.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            component={Link}
            href="/movimientos"
            variant="contained"
            color="primary"
            size="large"
          >
            Empezar ahora
          </Button>
          <Button
            component={Link}
            href="/reportes"
            variant="outlined"
            color="primary"
            size="large"
          >
            Ver reportes
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {cotizaciones.map((c) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={c.nombre}
            component="div" 
          >
            <Card
              sx={{
                bgcolor: "rgba(0,255,0,0.05)",
                border: "1px solid #39ff14",
                borderRadius: 3,
                textAlign: "center",
                boxShadow: "0 0 12px rgba(57,255,20,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 0 20px rgba(57,255,20,0.6)",
                  bgcolor: "rgba(0,255,0,0.08)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: "#39ff14", fontWeight: 600, mb: 1 }}
                >
                  {c.nombre}
                </Typography>
                <Typography variant="body1" color="white">
                  Compra: <strong>${c.compra}</strong>
                </Typography>
                <Typography variant="body1" color="white">
                  Venta: <strong>${c.venta}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
