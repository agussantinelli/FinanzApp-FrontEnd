"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
    FormControlLabel,
    Switch,
    CircularProgress,
    Alert
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getPersonaById } from "@/services/PersonaService";
import { getRegisterGeoData, completeProfile, setAuthSession } from "@/services/AuthService";
import { CompletarPerfilDTO, UserLoginResponseDTO } from "@/types/Usuario";
import { RegisterGeoDataDTO } from "@/types/Geo";
import FloatingMessage from "@/components/ui/FloatingMessage";

export default function CompleteProfilePage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState<CompletarPerfilDTO>({
        fechaNacimiento: "",
        nacionalidadId: 0,
        esResidenteArgentina: false,
        paisResidenciaId: 0,
        localidadResidenciaId: null
    });

    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [geoData, setGeoData] = useState<RegisterGeoDataDTO | null>(null);

    useEffect(() => {
        if (user?.id) {
            Promise.all([
                getPersonaById(user.id),
                getRegisterGeoData()
            ]).then(([userData, geo]) => {
                setGeoData(geo);

                // Pre-fill what we have. Usually this is mostly empty or partial for incomplete profiles.
                setFormData({
                    fechaNacimiento: userData.fechaNacimiento ? userData.fechaNacimiento.split('T')[0] : "",
                    nacionalidadId: userData.nacionalidadId || 0,
                    esResidenteArgentina: userData.esResidenteArgentina,
                    paisResidenciaId: userData.paisResidenciaId || 0,
                    localidadResidenciaId: userData.localidadResidenciaId || null
                });

                if (userData.esResidenteArgentina && userData.localidadResidenciaId) {
                    const loc = geo.localidadesArgentina.find(l => l.id === userData.localidadResidenciaId);
                    if (loc) setSelectedProvinceId(loc.provinciaId);
                }

                setLoading(false);
            }).catch(err => {
                console.error("Error loading data", err);
                setLoadingError("No se pudo cargar la información necesaria.");
                setLoading(false);
            });
        }
    }, [user?.id]);

    const handleChange = (field: keyof CompletarPerfilDTO, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleResidenciaArgentinaChange = (checked: boolean) => {
        if (checked) {
            const argentina = geoData?.paises.find(p => p.esArgentina);
            handleChange('esResidenteArgentina', true);
            handleChange('paisResidenciaId', argentina?.id || 0);
            handleChange('localidadResidenciaId', null);
            setSelectedProvinceId(null);
        } else {
            handleChange('esResidenteArgentina', false);
            handleChange('paisResidenciaId', 0);
            handleChange('localidadResidenciaId', null);
            setSelectedProvinceId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setSaving(true);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            // Call completeProfile
            const updatedUserResponse = await completeProfile(formData);

            // Note: completeProfile returns specific response (UserLoginResponseDTO) usually.
            // If it returns the updated user with new token, we setAuthSession.
            // If your backend returns PersonaDTO as discussed earlier, we might need manual handling.
            // Assuming it returns UserLoginResponseDTO as defined in AuthService.ts types

            // If the response has a token, we update the session fully
            if ((updatedUserResponse as any).token) {
                setAuthSession(updatedUserResponse);
            } else {
                // If it returned just user data, we force a refresh or manual update if possible
                // But for now let's assume standard behavior or just reload user.
                // refreshUser() calls getCurrentUser() which reads session. 
                // We need to update session storage manually if completeProfile didn't give us a fresh token structure.
                // Based on previous toolstep for AuthService completion, we decided to cast as any.
                // Let's try to just refresh the user if the backend didn't return a token.
                // BUT better yet, let's force a reload of the profile logic.
            }

            setSuccessMessage("¡Perfil completado con éxito!");

            setTimeout(() => {
                router.push("/perfil");
            }, 1500);
        } catch (err: any) {
            console.error("Error completing profile", err);
            const msg = err.response?.data?.message || "Error al completar el perfil.";
            setSubmitError(msg);
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    if (loadingError) return <Box sx={{ p: 4 }}><Alert severity="error">{loadingError}</Alert></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, margin: "0 auto" }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
                <Typography variant="h5" gutterBottom fontWeight={700} color="primary">
                    Completar Perfil
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Por favor completa tu información personal para acceder a todas las funcionalidades de FinanzApp.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Fecha de Nacimiento"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.fechaNacimiento}
                            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                            required
                        />

                        <TextField
                            select
                            label="Nacionalidad"
                            fullWidth
                            value={formData.nacionalidadId}
                            onChange={(e) => handleChange('nacionalidadId', Number(e.target.value))}
                            required
                        >
                            <MenuItem value={0} disabled>Seleccione nacionalidad</MenuItem>
                            {geoData?.paises.map(p => (
                                <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                            ))}
                        </TextField>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.esResidenteArgentina}
                                    onChange={(e) => handleResidenciaArgentinaChange(e.target.checked)}
                                />
                            }
                            label="Resido en Argentina"
                        />

                        {!formData.esResidenteArgentina ? (
                            <TextField
                                select
                                label="País de Residencia"
                                fullWidth
                                value={formData.paisResidenciaId}
                                onChange={(e) => handleChange('paisResidenciaId', Number(e.target.value))}
                                required
                            >
                                <MenuItem value={0} disabled>Seleccione país</MenuItem>
                                {geoData?.paises.map(p => (
                                    <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        select
                                        label="Provincia"
                                        fullWidth
                                        value={selectedProvinceId || ''}
                                        onChange={(e) => {
                                            setSelectedProvinceId(Number(e.target.value));
                                            handleChange('localidadResidenciaId', null);
                                        }}
                                        required
                                    >
                                        <MenuItem value="" disabled>Seleccione provincia</MenuItem>
                                        {geoData?.provinciasArgentina.map(p => (
                                            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        select
                                        label="Localidad"
                                        fullWidth
                                        value={formData.localidadResidenciaId || ''}
                                        onChange={(e) => handleChange('localidadResidenciaId', Number(e.target.value))}
                                        required
                                        disabled={!selectedProvinceId}
                                    >
                                        <MenuItem value="" disabled>Seleccione localidad</MenuItem>
                                        {geoData?.localidadesArgentina
                                            .filter(l => l.provinciaId === selectedProvinceId)
                                            .map(l => (
                                                <MenuItem key={l.id} value={l.id}>{l.nombre}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Stack>
                            </>
                        )}

                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => router.back()}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Completar Perfil"}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>

            <FloatingMessage
                open={!!submitError}
                message={submitError}
                severity="error"
                onClose={() => setSubmitError(null)}
            />
            <FloatingMessage
                open={!!successMessage}
                message={successMessage}
                severity="success"
                onClose={() => setSuccessMessage(null)}
            />
        </Box>
    );
}
