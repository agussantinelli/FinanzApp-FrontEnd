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
import { getPersonaById, updatePersona } from "@/services/PersonaService";
import { getRegisterGeoData } from "@/services/AuthService";
import { UserDTO, UserUpdateRequest } from "@/types/Usuario";
import { RegisterGeoDataDTO, PaisDTO, ProvinciaDTO, LocalidadDTO } from "@/types/Geo";

export default function EditProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState<UserUpdateRequest>({
        nombre: "",
        apellido: "",
        fechaNac: "",
        rol: "",
        esResidenteArgentina: false,
        paisResidenciaId: 0,
        paisNacionalidadId: 0,
        localidadResidenciaId: null
    });

    // Aux state for province selection (not in update payload but needed for UI)
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);

    // Geo Data
    const [geoData, setGeoData] = useState<RegisterGeoDataDTO | null>(null);

    useEffect(() => {
        if (user?.id) {
            Promise.all([
                getPersonaById(user.id),
                getRegisterGeoData()
            ]).then(([userData, geo]) => {
                setGeoData(geo);

                // Initialize Form
                setFormData({
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    fechaNac: userData.fechaNacimiento ? userData.fechaNacimiento.split('T')[0] : "",
                    rol: userData.rol,
                    esResidenteArgentina: userData.esResidenteArgentina,
                    paisResidenciaId: userData.paisResidenciaId || 0,
                    paisNacionalidadId: userData.nacionalidadId || 0,
                    localidadResidenciaId: userData.localidadResidenciaId || null
                });

                // Infer province if argentina and locality is set (This is tricky without locality objects having provinceId reference easily accessible in a flat list if not loaded... 
                // but RegisterGeoDataDTO has localitiesArgentina which has provinceId.
                if (userData.esResidenteArgentina && userData.localidadResidenciaId) {
                    const loc = geo.localidadesArgentina.find(l => l.id === userData.localidadResidenciaId);
                    if (loc) setSelectedProvinceId(loc.provinciaId);
                }

                setLoading(false);
            }).catch(err => {
                console.error("Error loading data", err);
                setError("No se pudo cargar la información");
                setLoading(false);
            });
        }
    }, [user?.id]);

    const handleChange = (field: keyof UserUpdateRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleResidenciaArgentinaChange = (checked: boolean) => {
        if (checked) {
            // Find Argentina ID
            const argentina = geoData?.paises.find(p => p.esArgentina);
            handleChange('esResidenteArgentina', true);
            handleChange('paisResidenciaId', argentina?.id || 0);
            handleChange('localidadResidenciaId', null);
            setSelectedProvinceId(null);
        } else {
            handleChange('esResidenteArgentina', false);
            handleChange('paisResidenciaId', 0); // Reset or let user choose
            handleChange('localidadResidenciaId', null);
            setSelectedProvinceId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setSaving(true);
        setError(null);
        try {
            await updatePersona(user.id, formData);
            router.push("/perfil");
        } catch (err) {
            console.error("Error updating profile", err);
            setError("Error al guardar los cambios.");
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, margin: "0 auto" }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
                <Typography variant="h5" gutterBottom fontWeight={700}>Editar Perfil</Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ mt: 3 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                value={formData.nombre}
                                onChange={(e) => handleChange('nombre', e.target.value)}
                                required
                            />
                            <TextField
                                label="Apellido"
                                fullWidth
                                value={formData.apellido}
                                onChange={(e) => handleChange('apellido', e.target.value)}
                                required
                            />
                        </Stack>

                        <TextField
                            label="Fecha de Nacimiento"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.fechaNac}
                            onChange={(e) => handleChange('fechaNac', e.target.value)}
                            required
                        />

                        <TextField
                            select
                            label="Nacionalidad"
                            fullWidth
                            value={formData.paisNacionalidadId}
                            onChange={(e) => handleChange('paisNacionalidadId', Number(e.target.value))}
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
                                            handleChange('localidadResidenciaId', null); // Reset locality
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

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                                {saving ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
