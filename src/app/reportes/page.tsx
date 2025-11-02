import { Typography, Grid } from "@mui/material";
import GridV1 from "@mui/material/Grid"; // evita el choque con Grid2
import DolarBarChart from "@/components/charts/DolarBarChart";

export default function Reportes() {
  return (
    <main style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Vista temporal con datos actuales del backend. Próximamente más métricas y series históricas.
      </Typography>

      <GridV1 container spacing={3}>
        <GridV1 item xs={12} md={8}>
          <DolarBarChart />
        </GridV1>
      </GridV1>
    </main>
  );
}
