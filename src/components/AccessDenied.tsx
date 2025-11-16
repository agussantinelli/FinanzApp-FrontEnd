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

export function AccessDenied({
  title = "Acceso restringido",
  message = "No tenés permisos para ver esta sección.",
  backHref = "/",
  backLabel = "Volver al inicio",
}: AccessDeniedProps) {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 96px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: 3,
          maxWidth: 480,
          width: "100%",
          borderRadius: 3,
          bgcolor: "rgba(15,15,15,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          <Button
            component={Link}
            href={backHref}
            variant="contained"
            sx={{ textTransform: "none", mt: 1 }}
          >
            {backLabel}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
