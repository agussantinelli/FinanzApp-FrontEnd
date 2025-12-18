"use client";

import { Alert, Box } from "@mui/material";

import { FormStatusProps } from "@/types/ComponentProps";

import styles from "./styles/FormStatus.module.css";

export function FormStatus({ successMessage, errorMessage }: FormStatusProps) {
  if (!successMessage && !errorMessage) return null;

  return (
    <Box className={styles.container}>
      {successMessage && (
        <Alert severity="success" className={styles.alert}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}
