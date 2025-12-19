"use client";

import { useDolarData } from "@/hooks/useDolarData";
import { DolarDTO } from "@/types/Dolar";
import {
  Paper, Box, Typography, Divider, Button, Grid,
  CircularProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Link from "next/link";
import BarChartIcon from "@mui/icons-material/BarChart";
import styles from "./styles/DolarSection.module.css";
import DolarCard from "@/components/cards/DolarCard";




export default function DolarSection() {
  const {
    firstRow,
    secondRow,
    loading,
    updatedAt,
    fetchData,
    normalizeName
  } = useDolarData();

  return (
    <Paper className={styles.sectionPaper}>
      <div className={styles.headerContainer}>
        <Box>
          <Typography variant="h5" className={styles.headerTitle}>
            Cotizaciones del dólar
          </Typography>
          {updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          )}
        </Box>

        <div className={styles.actionButtons}>
          <Button
            component={Link}
            href="/reportes/dolar"
            variant="contained"
            color="primary"
            startIcon={<BarChartIcon />}
            className={styles.chartButton}
          >
            Ver gráfico
          </Button>

          <Button
            onClick={fetchData}
            variant="outlined"
            color="primary"
            startIcon={loading ? <CircularProgress size={18} /> : <RefreshIcon />}
            disabled={loading}
            className={styles.refreshButton}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </div>

      <Divider className={styles.sectionDivider} />

      <Box display="flex" flexDirection="column" gap={{ xs: 2, md: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          {firstRow.map((c, i) => {
            const label = normalizeName(c?.nombre) || "—";
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`row1-${i}`} component="div">
                <DolarCard data={c} title={label} />
              </Grid>
            );
          })}
        </Grid>

        {secondRow.length > 0 && (
          <Grid container spacing={3} justifyContent="center">
            {secondRow.map((c, i) => {
              const label = normalizeName(c?.nombre) || "—";
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`row2-${i}`} component="div">
                  <DolarCard data={c} title={label} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Paper>
  );
}
