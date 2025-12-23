"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";

import DolarSection from "@/components/sections/DolarSection";
import CedearsSection from "@/components/sections/CedearsSection";
import IndexesSection from "@/components/sections/IndexesSection";
import CryptoSection from "@/components/sections/CryptoSection";
import AccionesARGYSection from "@/components/sections/AccionesARGYSection";
import MarketHoursCard from "@/components/sections/MarketHoursCard";

import { useAuth } from "@/hooks/useAuth";
import { getHomePathForRole } from "@/services/AuthService";
import { useEffect, useState } from "react";

import styles from "./styles/Home.module.css";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dashboardHref = getHomePathForRole(user?.rol ?? null);
  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box className={styles.headerBox}>
        <Typography variant="h3" className={styles.title}>
          Controlá tus finanzas con{" "}
          <span className={styles.brandSpan}>FinanzApp</span>
        </Typography>
        <Typography variant="h6" color="text.secondary" className={styles.subtitle}>
          Registrá movimientos, organizá categorías y obtené reportes claros.
        </Typography>

        <div className={styles.buttonStack}>
          {mounted && isAuthenticated ? (
            <Button
              component={Link}
              href={dashboardHref}
              variant="contained"
              color="primary"
              size="large"
            >
              Ir al panel
            </Button>
          ) : (
            <Button
              component={Link}
              href="/auth/login"
              variant="contained"
              color="primary"
              size="large"
            >
              Empezar ahora
            </Button>
          )}          <Button
            component={Link}
            href="/activos"
            variant="outlined"
            color="primary"
            size="large"
          >
            Activos Disponibles
          </Button>
        </div>
      </Box>

      <Box className={styles.sectionBox}>
        <DolarSection />
      </Box>
      <Box className={styles.sectionBox}>
        <AccionesARGYSection />
      </Box>
      <Box className={styles.sectionBox}>
        <CedearsSection />
      </Box>
      <Box className={styles.sectionBox}>
        <IndexesSection />
      </Box>
      <Box className={styles.sectionBox}>
        <CryptoSection />
      </Box>
      <Box className={styles.marketHoursBox}>
        <MarketHoursCard />
      </Box>
    </Container>
  );
}
