"use client";

import * as React from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  MenuItem,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";
import { FormStatus } from "@/components/FormStatus";
import styles from "./styles/Register.module.css";


export default function RegisterPage() {
  const {
    // State
    nombre, setNombre,
    apellido, setApellido,
    email, setEmail,
    fechaNac, setFechaNac,
    password, setPassword,
    password2, setPassword2,
    paisNacId, setPaisNacId,
    paisResidenciaId, setPaisResidenciaId,
    provinciaResidenciaId, setProvinciaResidenciaId,
    localidadResidenciaId, setLocalidadResidenciaId,

    // Geo Data
    geoData,
    loadingGeo,
    errorGeo,
    provinciasParaCombo,
    localidadesParaCombo,
    esResidenciaArgentina,

    // Status
    submitting,
    fieldErrors,
    apiError,
    successSubmit,

    // Handlers
    handleSubmit,
    clearFieldError
  } = useRegister();

  if (loadingGeo) {
    return (
      <Box className={styles.loadingContainer}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Cargando...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (errorGeo || !geoData) {
    return (
      <Box className={styles.container}>
        <Paper className={styles.errorCard}>
          <Typography variant="h6" className={styles.errorTitle}>
            Error al cargar datos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {errorGeo ??
              "Ocurrió un problema al cargar los datos de registro. Intentá recargar la página."}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Paper elevation={6} className={styles.card}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" className={styles.title}>
              Crear cuenta
            </Typography>
            <Typography variant="body2" className={styles.subtitle}>
              Registrate en FinanzApp para empezar a gestionar tu portafolio.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <div className={styles.formStack}>
              <Typography variant="subtitle1" className={styles.sectionTitle}>
                Datos personales
              </Typography>

              <TextField
                label="Nombre"
                fullWidth
                required
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  clearFieldError('nombre');
                }}
                error={!!fieldErrors.nombre}
                helperText={fieldErrors.nombre}
              />

              <TextField
                label="Apellido"
                fullWidth
                required
                value={apellido}
                onChange={(e) => {
                  setApellido(e.target.value);
                  clearFieldError('apellido');
                }}
                error={!!fieldErrors.apellido}
                helperText={fieldErrors.apellido}
              />

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
                label="Fecha de nacimiento"
                type="date"
                fullWidth
                required
                value={fechaNac}
                onChange={(e) => {
                  setFechaNac(e.target.value);
                  clearFieldError('fechaNac');
                }}
                InputLabelProps={{ shrink: true }}
                error={!!fieldErrors.fechaNac}
                helperText={fieldErrors.fechaNac}
              />

              <TextField
                select
                label="Nacionalidad"
                fullWidth
                required
                value={paisNacId}
                onChange={(e) => {
                  setPaisNacId(e.target.value);
                  clearFieldError('paisNacId');
                }}
                error={!!fieldErrors.paisNacId}
                helperText={fieldErrors.paisNacId}
              >
                {geoData.paises.map((p) => (
                  <MenuItem key={p.id} value={p.id.toString()}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="subtitle1" className={styles.sectionTitle}>
                Residencia
              </Typography>

              <TextField
                select
                label="País de residencia"
                fullWidth
                required
                value={paisResidenciaId}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setPaisResidenciaId(newValue);
                  setProvinciaResidenciaId("");
                  setLocalidadResidenciaId("");
                  clearFieldError('paisResidenciaId');
                }}
                error={!!fieldErrors.paisResidenciaId}
                helperText={fieldErrors.paisResidenciaId}
              >
                {geoData.paises.map((p) => (
                  <MenuItem key={p.id} value={p.id.toString()}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </TextField>

              {esResidenciaArgentina && (
                <>
                  <TextField
                    select
                    label="Provincia de residencia"
                    fullWidth
                    required
                    value={provinciaResidenciaId}
                    onChange={(e) => {
                      setProvinciaResidenciaId(e.target.value);
                      setLocalidadResidenciaId("");
                      clearFieldError('provinciaResidenciaId');
                    }}
                    error={!!fieldErrors.provinciaResidenciaId}
                    helperText={fieldErrors.provinciaResidenciaId}
                  >
                    {provinciasParaCombo.map((pr) => (
                      <MenuItem key={pr.id} value={pr.id.toString()}>
                        {pr.nombre}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Localidad de residencia"
                    fullWidth
                    required
                    value={localidadResidenciaId}
                    onChange={(e) => {
                      setLocalidadResidenciaId(e.target.value);
                      clearFieldError('localidadResidenciaId');
                    }}
                    disabled={!provinciaResidenciaId}
                    error={!!fieldErrors.localidadResidenciaId}
                    helperText={fieldErrors.localidadResidenciaId}
                  >
                    {localidadesParaCombo.map((loc) => (
                      <MenuItem key={loc.id} value={loc.id.toString()}>
                        {loc.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}

              <Typography variant="subtitle1" className={styles.sectionTitle}>
                Seguridad
              </Typography>

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
                autoComplete="new-password"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
              />

              <TextField
                label="Repetir contraseña"
                type="password"
                fullWidth
                required
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  clearFieldError('password2');
                }}
                autoComplete="new-password"
                error={!!fieldErrors.password2}
                helperText={fieldErrors.password2}
              />

              <FormStatus
                successMessage={successSubmit}
                errorMessage={apiError}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                className={styles.submitButton}
              >
                {submitting ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </div>
          </Box>

          <Box className={styles.footer}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tenés una cuenta?{" "}
              <MuiLink component={Link} href="/auth/login" underline="hover">
                Iniciar sesión
              </MuiLink>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
