import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; 
import DolarBarChart from "@/components/charts/DolarBarChart";

export default function ReporteDolar() {
  return (
    <main style={{ padding: 24 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Gráfico — Cotizaciones del Dólar (ARS)
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Este gráfico compara precios de <strong>Compra</strong> y <strong>Venta</strong> para
          los principales tipos de cambio (Oficial, MEP, CCL, Blue, etc.). Los datos se leen
          en tiempo real desde tu backend y se formatean en ARS.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DolarBarChart />
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
