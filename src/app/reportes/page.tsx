import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import DolarBarChart from "@/components/charts/DolarBarChart";
import styles from "./styles/Reportes.module.css";

export default function Reportes() {
  return (
    <main className={styles.container}>
      <Box className={styles.maxWidthContainer}>
        <Typography variant="h4" gutterBottom className={styles.headerTitle}>
          Reportes
        </Typography>
        <Typography variant="body2" className={styles.description} paragraph>
          Vista temporal con datos actuales del backend. Próximamente más métricas y series históricas.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <DolarBarChart />
          </Grid>

          {/* Slot para un segundo card: por ejemplo, un resumen de patrimonio */}
          <Grid item xs={12} md={4}>
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
