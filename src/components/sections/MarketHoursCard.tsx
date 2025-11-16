"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function MarketHoursCard() {
  return (
    <Card
      sx={(t) => ({
        bgcolor: t.custom.cardBg,
        border: `1px solid ${t.custom.borderColor}`,
        borderRadius: 3,
        boxShadow: t.custom.shadow,
        maxWidth: 420,
        mx: "auto",
        mt: 3,
        backdropFilter: "blur(3px)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: t.custom.shadowHover,
        },
      })}
    >
      <CardContent sx={{ py: 2.5, px: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <AccessTimeIcon
            sx={(t) => ({
              mr: 1,
              color: t.palette.primary.main,
              fontSize: 22,
            })}
          />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700 }}
          >
            Horarios de mercado (hora AR)
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>NYSE</strong> (New York Stock Exchange): 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Nasdaq</strong>: 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2">
          <strong>BYMA</strong> (Bolsa y Mercados Argentinos): 10:30 a 17:00 — acciones, CEDEARs y otros instrumentos.
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1.5 }}
        >
          Nota: los horarios de NYSE y Nasdaq pueden correrse a 10:30–17:00
          cuando en EE.UU. rige el horario de verano.
        </Typography>
      </CardContent>
    </Card>
  );
}
