"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Divider,
    Stack,
    Chip,
    CircularProgress,
    Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getPersonaById, uploadUserPhoto } from "@/services/PersonaService";
import { UserDTO } from "@/types/Usuario";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<UserDTO | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            getPersonaById(user.id)
                .then(data => {
                    setProfile(data);
                })
                .catch(err => {
                    console.error("Error loading profile:", err);
                })
                .finally(() => {
                    setLoadingProfile(false);
                });
        }
    }, [user?.id]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0 || !user?.id) return;

        const file = event.target.files[0];
        setUploading(true);

        try {
            await uploadUserPhoto(user.id, file);
            // Refresh profile data to get the new image URL (assuming backend returns it or we just reload)
            const updatedProfile = await getPersonaById(user.id);
            setProfile(updatedProfile);
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Error al subir la foto");
        } finally {
            setUploading(false);
        }
    };

    if (!user) return <Box sx={{ p: 4 }}>Cargando sesión...</Box>;
    if (loadingProfile) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    if (!profile) return <Box sx={{ p: 4 }}>No se pudo cargar la información del perfil.</Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: "0 auto" }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>

                {/* Header */}
                <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3} sx={{ mb: 4 }}>
                    <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                        <Avatar
                            src={profile.urlFotoPerfil}
                            sx={{ width: 100, height: 100, fontSize: '2.5rem', bgcolor: 'primary.main' }}
                        >
                            {profile.nombre[0]}{profile.apellido[0]}
                        </Avatar>

                        <Box
                            component="label"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                '&:hover': { opacity: 1 }
                            }}
                        >
                            {uploading ? <CircularProgress size={24} color="inherit" /> : <EditIcon />}
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} disabled={uploading} />
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                        <Typography variant="h4" fontWeight={700}>
                            {profile.nombre} {profile.apellido}
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent={{ xs: "center", sm: "flex-start" }} alignItems="center" mt={1}>
                            <Chip label={profile.rol} color="secondary" size="small" />
                            <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                        </Stack>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        component={Link}
                        href="/perfil/editar"
                        variant="outlined"
                        color="inherit"
                        sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                        Editar Perfil
                    </Button>
                </Stack>

                <Divider sx={{ mb: 4 }} />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom color="primary">Información Personal</Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Fecha de Nacimiento</Typography>
                                <Typography>
                                    {profile.fechaNacimiento
                                        ? new Date(profile.fechaNacimiento).toLocaleDateString()
                                        : "No especificada"}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Nacionalidad</Typography>
                                <Typography>{profile.nacionalidadNombre || "No especificada"}</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom color="primary">Residencia</Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">País</Typography>
                                <Typography>{profile.paisResidenciaNombre || "No especificado"}</Typography>
                            </Box>
                            {profile.provinciaResidenciaNombre && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Provincia</Typography>
                                    <Typography>{profile.provinciaResidenciaNombre}</Typography>
                                </Box>
                            )}
                            {profile.localidadResidenciaNombre && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Localidad</Typography>
                                    <Typography>{profile.localidadResidenciaNombre}</Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Stack>

            </Paper>
        </Box>
    );
}
