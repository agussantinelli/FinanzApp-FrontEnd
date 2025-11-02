import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import DolarBarChart from "@/components/charts/DolarBarChart";

export default function Reportes() {
  return (
    <main style={{ padding: 24 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Reportes
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Vista temporal con datos actuales del backend. Próximamente más métricas y series históricas.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <DolarBarChart />
          </Grid>

          {/* Slot para un segundo card: por ejemplo, un resumen de patrimonio */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: 460,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
                background:
                  "linear-gradient(180deg, rgba(57,255,20,0.06) 0%, rgba(57,255,20,0.02) 100%)",
              }}
            >
              <Typography variant="h6">Resumen rápido</Typography>
              <Typography variant="body2" color="text.secondary">
                Próximamente: Patrimonio total, distribución por clase y alertas.
              </Typography>
              <Box sx={{ flexGrow: 1, display: "grid", placeItems: "center", opacity: 0.7 }}>
                <Typography variant="caption">Widget en construcción</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
