"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        textAlign: "center",
        color: "text.secondary",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} FinanzApp — Todos los derechos reservados
      </Typography>
    </Box>
  );
}
