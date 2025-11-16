"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";

import DolarSection from "@/components/sections/DolarSection";
import CedearsSection from "@/components/sections/CedearsSection";
import CryptoSection from "@/components/sections/CryptoSection";
import AccionesARGYSection from "@/components/sections/AccionesARGYSection";

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Controlá tus finanzas con{" "}
          <span style={{ color: "#39ff14" }}>FinanzApp</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Registrá movimientos, organizá categorías y obtené reportes claros.
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 2 }}
        >
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

      <Box sx={{ mt: 6 }}>
        <DolarSection />
      </Box>
      <Box sx={{ mt: 6 }}>
        <AccionesARGYSection />
      </Box>
      <Box sx={{ mt: 6 }}>
        <CedearsSection />
      </Box>
      <Box sx={{ mt: 6 }}>
        <CryptoSection />
      </Box>

      <Box sx={{ mt: 8 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Horarios de mercados (hora de Argentina)
        </Typography>
        <Typography variant="body2">
          NYSE (New York Stock Exchange): 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2">
          Nasdaq: 11:30 a 18:00 — rueda regular.
        </Typography>
        <Typography variant="body2">
          BYMA (Bolsa y Mercados Argentinos): 10:30 a 17:00 — acciones, CEDEARs,
          opciones y otros instrumentos.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          Nota: los horarios de NYSE y Nasdaq pueden correrse una hora (10:30 a
          17:00) cuando en EE.UU. rige el horario de verano.
        </Typography>
      </Box>
    </Container>
  );
}
