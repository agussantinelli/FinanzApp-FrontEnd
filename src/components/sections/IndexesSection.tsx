"use client";

import React from "react";
import {
    Paper, Typography, Button, Grid,
    CircularProgress, Divider, Box
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DualQuoteDTO } from "@/types/Market";
import { useIndicesData } from "@/hooks/useIndicesData";
import styles from "./styles/IndexesSection.module.css";
import IndexCard from "@/components/cards/IndexCard";

export default function IndexesSection() {
    const {
        data,
        row1,
        row2,
        national,
        loading,
        updatedAt,
        fetchData,
        formatARS,
        formatUSD,
    } = useIndicesData();



    return (
        <Paper className={styles.sectionPaper}>
            <div className={styles.headerContainer}>
                <Box>
                    <Typography variant="h5" className={styles.headerTitle}>
                        Tablero de Índices
                    </Typography>
                    {updatedAt && (
                        <Typography variant="caption" color="text.secondary">
                            Última actualización: {updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                    )}
                </Box>
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

            <Divider className={styles.sectionDivider} />

            {data.length === 0 && !loading && (
                <Typography color="text.secondary">Cargando índices de mercado...</Typography>
            )}

            {(row1.length > 0 || row2.length > 0) && (
                <>
                    <Typography variant="subtitle1" className={styles.sectionSubtitle}>
                        Wall Street & Emergentes
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={3}>
                        {row1.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row1.map((d, idx) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.usSymbol || idx}>
                                        <IndexCard data={d} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {row2.length > 0 && (
                            <Grid container spacing={3} justifyContent="center">
                                {row2.map((d, idx) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.usSymbol || idx}>
                                        <IndexCard data={d} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </>
            )}

            {national.length > 0 && (
                <>
                    <Divider className={styles.sectionDividerSoft} />
                    <Typography variant="subtitle1" className={styles.sectionSubtitle}>
                        Argentina
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {national.map((d, idx) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.usSymbol || idx}>
                                <IndexCard data={d} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Paper>
    );
}