"use client";

import styles from "./styles/Recomendaciones.module.css";
import { Typography } from "@mui/material";

export default function RecomendacionesPage() {
    return (
        <main className={styles.container}>
            <Typography variant="h4" className={styles.title}>
                Recomendaciones
            </Typography>
            <Typography color="text.secondary">
                Próximamente: Sugerencias de inversión personalizadas.
            </Typography>
        </main>
    );
}
