"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>FinanzApp</Typography>
        <Typography>¡Bienvenido! Este es mi Home.</Typography>
      </Box>
    </Container>
  );
}
