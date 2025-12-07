"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import styles from "./styles/Footer.module.css";

export default function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Typography variant="body2">
        © {new Date().getFullYear()} FinanzApp — Todos los derechos reservados
      </Typography>
    </Box>
  );
}
