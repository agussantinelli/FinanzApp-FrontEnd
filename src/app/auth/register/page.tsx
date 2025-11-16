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
import {
  getRegisterGeoData,
  register as registerService,
} from "@/services/AuthService";
import { RegisterGeoDataDTO } from "@/types/RegisterGeoData";
import { useRouter } from "next/navigation";
import { FormStatus } from "@/components/FormStatus";

type RegisterFieldErrors = {
  nombre?: string;
  apellido?: string;
  email?: string;
  fechaNac?: string;
  password?: string;
  password2?: string;
  paisNacId?: string;
  paisResidenciaId?: string;
  provinciaResidenciaId?: string;
  localidadResidenciaId?: string;
};

export default function RegisterPage() {
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fechaNac, setFechaNac] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  const [paisNacId, setPaisNacId] = React.useState<string>("");
  const [paisResidenciaId, setPaisResidenciaId] = React.useState<string>("");
  const [provinciaResidenciaId, setProvinciaResidenciaId] =
    React.useState<string>("");
  const [localidadResidenciaId, setLocalidadResidenciaId] =
    React.useState<string>("");

  const [geoData, setGeoData] = React.useState<RegisterGeoDataDTO | null>(null);
  const [loadingGeo, setLoadingGeo] = React.useState(true);
  const [errorGeo, setErrorGeo] = React.useState<string | null>(null);

  const [submitting, setSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] =
    React.useState<RegisterFieldErrors>({});
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successSubmit, setSuccessSubmit] = React.useState<string | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoadingGeo(true);
        const data = await getRegisterGeoData();
        if (!mounted) return;
        setGeoData(data);

        const ar = data.paises.find((p) => p.codigoIso2 === "AR");
        const arId = ar ? ar.id.toString() : "";

        setPaisNacId((prev) => prev || arId);
        setPaisResidenciaId((prev) => prev || arId);
      } catch (err) {
        if (!mounted) return;
        setErrorGeo("No se pudieron cargar países/provincias/localidades.");
      } finally {
        if (mounted) setLoadingGeo(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const argentinaId = React.useMemo(() => {
    if (!geoData) return "";
    const ar = geoData.paises.find((p) => p.codigoIso2 === "AR");
    return ar ? ar.id.toString() : "";
  }, [geoData]);

  const esResidenciaArgentina = paisResidenciaId === argentinaId;

  const provinciasParaCombo = React.useMemo(() => {
    if (!geoData || !esResidenciaArgentina) return [];
    return geoData.provinciasArgentina;
  }, [geoData, esResidenciaArgentina]);

  const localidadesParaCombo = React.useMemo(() => {
    if (!geoData || !esResidenciaArgentina || !provinciaResidenciaId) return [];
    const provIdNum = Number(provinciaResidenciaId);
    return geoData.localidadesArgentina.filter(
      (l) => l.provinciaId === provIdNum
    );
  }, [geoData, esResidenciaArgentina, provinciaResidenciaId]);

  const validate = (): boolean => {
    const errors: RegisterFieldErrors = {};
    const emailTrim = email.trim();

    if (!nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!apellido.trim()) errors.apellido = "El apellido es obligatorio.";

    if (!emailTrim) {
      errors.email = "El email es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(emailTrim)) {
      errors.email = "El email no tiene un formato válido.";
    }

    if (!fechaNac) errors.fechaNac = "La fecha de nacimiento es obligatoria.";

    if (!password) errors.password = "La contraseña es obligatoria.";
    if (!password2) errors.password2 = "Debe repetir la contraseña.";
    if (password && password2 && password !== password2) {
      errors.password2 = "Las contraseñas no coinciden.";
    }

    if (!paisNacId) errors.paisNacId = "La nacionalidad es obligatoria.";
    if (!paisResidenciaId)
      errors.paisResidenciaId = "El país de residencia es obligatorio.";

    if (esResidenciaArgentina) {
      if (!provinciaResidenciaId)
        errors.provinciaResidenciaId =
          "La provincia de residencia es obligatoria.";
      if (!localidadResidenciaId)
        errors.localidadResidenciaId =
          "La localidad de residencia es obligatoria.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessSubmit(null);

    if (!validate()) return;

    const nacionalidadId = Number(paisNacId);
    const paisResidId = Number(paisResidenciaId);

    const payload = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      fechaNacimiento: fechaNac,
      password,
      nacionalidadId,
      paisResidenciaId: paisResidId,
      localidadResidenciaId: esResidenciaArgentina
        ? Number(localidadResidenciaId)
        : null,
      esResidenteArgentina: esResidenciaArgentina,
    };

    try {
      setSubmitting(true);
      await registerService(payload); // AuthService guarda token+user

      setSuccessSubmit("Cuenta creada correctamente. Redirigiendo…");
      setTimeout(() => {
        router.push("/auth/login");
      }, 800);
    } catch (err: any) {
      console.error("Error registro:", err);

      // Si el back devuelve mensaje tipo "Email ya registrado"
      const msgFromApi =
        err?.response?.data ?? "No se pudo completar el registro.";
      setApiError(msgFromApi);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGeo) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 96px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
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
          maxWidth: 520,
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
            <Stack spacing={2.2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Datos personales
              </Typography>

              <TextField
                label="Nombre"
                fullWidth
                required
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (fieldErrors.nombre) {
                    setFieldErrors((prev) => ({ ...prev, nombre: undefined }));
                  }
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
                  if (fieldErrors.apellido) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      apellido: undefined,
                    }));
                  }
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
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
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
                  if (fieldErrors.fechaNac) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      fechaNac: undefined,
                    }));
                  }
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
                  if (fieldErrors.paisNacId) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      paisNacId: undefined,
                    }));
                  }
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

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
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
                  if (fieldErrors.paisResidenciaId) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      paisResidenciaId: undefined,
                    }));
                  }
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
                      if (fieldErrors.provinciaResidenciaId) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          provinciaResidenciaId: undefined,
                        }));
                      }
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
                      if (fieldErrors.localidadResidenciaId) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          localidadResidenciaId: undefined,
                        }));
                      }
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

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
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
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
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
                  if (fieldErrors.password2) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password2: undefined,
                    }));
                  }
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
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {submitting ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
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
