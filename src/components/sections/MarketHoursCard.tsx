"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./styles/MarketHoursCard.css";

export default function MarketHoursCard() {
  return (
    <Card className="market-hours-card">
      <CardContent className="card-content">
        <Box className="header-box">
          <AccessTimeIcon className="clock-icon" />
          <Typography variant="subtitle1" className="header-title">
            Horarios de mercado (hora AR)
          </Typography>
        </Box>

        <Typography variant="body2" className="body-text">
          <strong>NYSE</strong> (New York Stock Exchange): 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2" className="body-text">
          <strong>Nasdaq</strong>: 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2">
          <strong>BYMA</strong> (Bolsa y Mercados Argentinos): 10:30 a 17:00 — acciones, CEDEARs y otros instrumentos.
        </Typography>

        <Typography variant="caption" className="footer-text">
          Nota: los horarios de NYSE y Nasdaq pueden correrse a 10:30–17:00
          cuando en EE.UU. rige el horario de verano.
        </Typography>
      </CardContent>
    </Card>
  );
}
