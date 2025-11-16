"use client";

import * as React from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { login } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { FormStatus } from "@/components/FormStatus";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones simples antes de llamar al back
    if (!email.trim()) {
      setError("El email es obligatorio.");
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria.");
      return;
    }

    try {
      setLoading(true);
      const resp = await login({ email, password });

      if (typeof window !== "undefined") {
        localStorage.setItem("fa_token", resp.token);
        localStorage.setItem(
          "fa_user",
          JSON.stringify({
            id: resp.personaId,
            nombre: resp.nombre,
            apellido: resp.apellido,
            email: resp.email,
            rol: resp.rol,
          })
        );
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error login:", err);
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 96px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          bgcolor: "rgba(15, 15, 15, 0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 0.5, letterSpacing: 0.4 }}
            >
              Iniciar sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accedé a tu panel de FinanzApp con tu correo y contraseña.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <FormStatus errorMessage={error} />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? "Ingresando..." : "Entrar"}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Todavía no tenés cuenta?{" "}
              <MuiLink component={Link} href="/auth/register" underline="hover">
                Crear cuenta
              </MuiLink>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
