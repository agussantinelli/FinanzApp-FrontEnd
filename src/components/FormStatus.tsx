"use client";

import { Alert, Box } from "@mui/material";

interface FormStatusProps {
  successMessage?: string | null;
  errorMessage?: string | null;
}

export function FormStatus({ successMessage, errorMessage }: FormStatusProps) {
  if (!successMessage && !errorMessage) return null;

  return (
    <Box sx={{ mt: 1 }}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: errorMessage ? 1 : 0 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Box>
  );
}
