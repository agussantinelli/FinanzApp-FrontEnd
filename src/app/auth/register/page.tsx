"use client";

import * as React from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  Grid,
  FormControlLabel,
  Switch,
  MenuItem,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";

export default function RegisterPage() {
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fechaNac, setFechaNac] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [residenteAr, setResidenteAr] = React.useState(true);

  const [paisNac, setPaisNac] = React.useState<string>("AR");
  const [paisResidencia, setPaisResidencia] = React.useState<string>("AR");
  const [localidadResidencia, setLocalidadResidencia] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      nombre,
      apellido,
      email,
      fechaNac,
      password,
      password2,
      residenteAr,
      paisNac,
      paisResidencia,
      localidadResidencia,
    });
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
          maxWidth: 760,
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
              Crear cuenta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registrate en FinanzApp para empezar a gestionar tu portafolio.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Datos personales
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Nombre"
                      fullWidth
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Apellido"
                      fullWidth
                      required
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha de nacimiento"
                      type="date"
                      fullWidth
                      required
                      value={fechaNac}
                      onChange={(e) => setFechaNac(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Nacionalidad"
                      fullWidth
                      required
                      value={paisNac}
                      onChange={(e) => setPaisNac(e.target.value)}
                    >
                      <MenuItem value="AR">Argentina</MenuItem>
                      <MenuItem value="US">Estados Unidos</MenuItem>
                      <MenuItem value="BR">Brasil</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Residencia
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={residenteAr}
                      onChange={(e) => setResidenteAr(e.target.checked)}
                    />
                  }
                  label="Soy residente en Argentina"
                />

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="País de residencia"
                      fullWidth
                      disabled={residenteAr}
                      value={paisResidencia}
                      onChange={(e) => setPaisResidencia(e.target.value)}
                    >
                      <MenuItem value="AR">Argentina</MenuItem>
                      <MenuItem value="US">Estados Unidos</MenuItem>
                      <MenuItem value="BR">Brasil</MenuItem>
                      {/* TODO: lista real de países desde backend */}
                    </TextField>
                  </Grid>

                  {residenteAr && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Localidad de residencia"
                        fullWidth
                        value={localidadResidencia}
                        onChange={(e) =>
                          setLocalidadResidencia(e.target.value)
                        }
                        placeholder="Ej: Rosario, CABA, Córdoba..."
                        // TODO: reemplazar por combo de localidades según provincia
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Contraseña */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Seguridad
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Contraseña"
                      type="password"
                      fullWidth
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Repetir contraseña"
                      type="password"
                      fullWidth
                      required
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Crear cuenta
              </Button>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tenés una cuenta?{" "}
              <MuiLink component={Link} href="/login" underline="hover">
                Iniciar sesión
              </MuiLink>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
