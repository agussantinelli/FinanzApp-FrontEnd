import Link from "next/link";
import { Box, Paper, Typography, Button } from "@mui/material";
import styles from "./styles/AccessDenied.module.css";

export default function AccessDeniedPage() {
  const title = "Acceso restringido";
  const message = "No tenés permisos para ver esta sección de FinanzApp.";
  const backHref = "/";
  const backLabel = "Volver al inicio";

  return (
    <Box className={styles.container}>
      <Paper className={styles.paper}>
        <div className={styles.contentStack}>
          <Typography variant="h6" className={styles.title}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          <Button
            component={Link}
            href={backHref}
            variant="contained"
            className={styles.button}
          >
            {backLabel}
          </Button>
        </div>
      </Paper>
    </Box>
  );
}
