import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import DolarBarChart from "@/components/charts/DolarBarChart";
import styles from "./styles/Reportes.module.css";
import PageHeader from "@/components/ui/PageHeader";

export default function Reportes() {
  return (
    <main className={styles.container}>
      <Box className={styles.maxWidthContainer}>
        <PageHeader
          title="Reportes"
          subtitle="Análisis y Métricas"
          description="Vista temporal con datos actuales del backend. Próximamente más métricas y series históricas."
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <DolarBarChart />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box className={styles.gradientCard}>
              <Typography variant="h6">Resumen rápido</Typography>
              <Typography variant="body2" color="text.secondary">
                Próximamente: Patrimonio total, distribución por clase y alertas.
              </Typography>
              <Box className={styles.widgetPlaceholder}>
                <Typography variant="caption">Widget en construcción</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
