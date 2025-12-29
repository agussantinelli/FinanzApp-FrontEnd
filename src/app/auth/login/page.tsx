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
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import FloatingMessage from "@/components/ui/FloatingMessage";

import styles from "./styles/Login.module.css";

import { Suspense } from "react";

function LoginContent() {
  const {
    email, setEmail,
    password, setPassword,
    loading,
    fieldErrors,
    serverError, setServerError,
    successMessage, setSuccessMessage,
    handleSubmit,
    clearFieldError
  } = useLogin();

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
                  clearFieldError('email');
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
                  clearFieldError('password');
                }}
                autoComplete="current-password"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
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

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <MuiLink component={Link} href="/auth/forgot-password" variant="body2" underline="hover">
                ¿Olvidaste tu contraseña?
              </MuiLink>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => alert("Funcionalidad de Google Login pendiente de integración frontend (SDK).")}
                disabled={loading}
              >
                Ingresar con Google
              </Button>
            </Box>
          </Box>

          <FloatingMessage
            open={!!serverError}
            message={serverError}
            severity="error"
            onClose={() => setServerError(null)}
          />
          <FloatingMessage
            open={!!successMessage}
            message={successMessage}
            severity="success"
            onClose={() => setSuccessMessage(null)}
          />

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

export default function LoginPage() {
  return (
    <Suspense fallback={<Box className={styles.container}><CircularProgress /></Box>}>
      <LoginContent />
    </Suspense>
  );
}
