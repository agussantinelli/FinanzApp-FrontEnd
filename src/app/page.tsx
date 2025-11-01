"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Controlá tus finanzas con <span style={{ color: "#39ff14" }}>FinanzApp</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Registra movimientos, organiza categorías y obtené reportes claros.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            component={Link}
            href="/movimientos"
            variant="contained"
            color="primary"
            size="large"
          >
            Empezar ahora
          </Button>
          <Button
            component={Link}
            href="/reportes"
            variant="outlined"
            color="primary"
            size="large"
          >
            Ver reportes
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
