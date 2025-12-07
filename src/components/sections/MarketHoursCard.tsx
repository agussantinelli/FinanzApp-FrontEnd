"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "./styles/MarketHoursCard.module.css";

export default function MarketHoursCard() {
  return (
    <Card className={styles.marketHoursCard}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.headerBox}>
          <AccessTimeIcon className={styles.clockIcon} />
          <Typography variant="subtitle1" className={styles.headerTitle}>
            Horarios de mercado (hora AR)
          </Typography>
        </Box>

        <Typography variant="body2" className={styles.bodyText}>
          <strong>NYSE</strong> (New York Stock Exchange): 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2" className={styles.bodyText}>
          <strong>Nasdaq</strong>: 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2" className={styles.bodyText}>
          <strong>BYMA</strong> (Bolsa y Mercados Argentinos): 10:30 a 17:00 — acciones, CEDEARs y otros instrumentos.
        </Typography>

        <Typography variant="caption" className={styles.footerText}>
          Nota: los horarios de NYSE y Nasdaq pueden correrse a 10:30–17:00
          cuando en EE.UU. rige el horario de verano.
        </Typography>
      </CardContent>
    </Card>
  );
}
