"use client";

import * as React from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";

type AccessDeniedProps = {
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
};

import styles from "./styles/AccessDenied.module.css";

export function AccessDenied({
  title = "Acceso restringido",
  message = "No tenés permisos para ver esta sección.",
  backHref = "/",
  backLabel = "Volver al inicio",
}: AccessDeniedProps) {
  return (
    <Box className={styles.container}>
      <Paper className={styles.paper}>
        <Stack spacing={2}>
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
        </Stack>
      </Paper>
    </Box>
  );
}
