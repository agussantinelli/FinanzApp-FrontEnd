import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import DolarBarChart from "@/components/charts/DolarBarChart";
import styles from "./styles/ReporteDolar.module.css";

export default function ReporteDolar() {
  return (
    <main className={styles.container}>
      <Box className={styles.maxWidthContainer}>
        <Typography variant="h4" gutterBottom className={styles.headerTitle}>
          Gráfico — Cotizaciones del Dólar (ARS)
        </Typography>

        <Typography variant="body2" className={styles.description} paragraph>
          Este gráfico compara precios de <strong>Compra</strong> y <strong>Venta</strong> para
          los principales tipos de cambio (Oficial, MEP, CCL, Blue, etc.). Los datos se leen
          en tiempo real desde tu backend y se formatean en ARS.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <DolarBarChart />
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
