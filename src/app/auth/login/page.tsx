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
import { login, getHomePathForRole } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { FormStatus } from "@/components/FormStatus";

type LoginErrors = {
  email?: string;
  password?: string;
};

import styles from "./styles/Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [fieldErrors, setFieldErrors] = React.useState<LoginErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const router = useRouter();

  const validate = (): boolean => {

    const errors: LoginErrors = {};
    const emailTrim = email.trim();

    if (!emailTrim) {
      errors.email = "El email es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(emailTrim)) {
      errors.email = "El email no tiene un formato válido.";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    try {
      setLoading(true);
      const resp = await login({ email, password });
      const destino = getHomePathForRole(resp.rol);

      setSuccessMessage("Inicio de sesión correcto. Redirigiendo…");

      setTimeout(() => {
        router.push(destino);
      }, 800);
    } catch (err) {
      console.error("Error login:", err);
      setServerError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Paper elevation={6} className={styles.card}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" className={styles.title}>
              Iniciar sesión
            </Typography>
            <Typography variant="body2" className={styles.subtitle}>
              Accedé a tu panel de FinanzApp con tu correo y contraseña.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <div className={styles.inputStack}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                autoComplete="email"
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
              />

              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
                autoComplete="current-password"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
              />

              <FormStatus
                errorMessage={serverError}
                successMessage={successMessage}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Ingresando..." : "Entrar"}
              </Button>
            </div>
          </Box>

          <Box className={styles.footer}>
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
