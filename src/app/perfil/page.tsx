"use client";

import React from "react";
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Divider,
    Stack,
    Chip
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
// Removed date-pickers to avoid dependency issues

export default function ProfilePage() {
    const { user, logout } = useAuth();

    if (!user) return <Box sx={{ p: 4 }}>Cargando perfil...</Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, margin: "0 auto" }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>

                {/* Header */}
                <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3} sx={{ mb: 4 }}>
                    <Avatar
                        sx={{ width: 100, height: 100, fontSize: '2.5rem', bgcolor: 'primary.main' }}
                    >
                        {user.nombre[0]}{user.apellido[0]}
                    </Avatar>
                    <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                        <Typography variant="h4" fontWeight={700}>
                            {user.nombre} {user.apellido}
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent={{ xs: "center", sm: "flex-start" }} alignItems="center" mt={1}>
                            <Chip label={user.rol} color="secondary" size="small" />
                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        </Stack>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* Edit Button Removed as requested */}
                </Stack>

                <Divider sx={{ mb: 4 }} />

                {/* Details Layout using Stack instead of Grid to avoid version conflicts */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom color="primary">Información Personal</Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Fecha de Nacimiento</Typography>
                                <Typography>{new Date((user as any).fechaNacimiento).toLocaleDateString()}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Nacionalidad</Typography>
                                <Typography>{(user as any).nacionalidadNombre || "No especificada"}</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom color="primary">Residencia</Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">País</Typography>
                                <Typography>{(user as any).paisResidenciaNombre || "No especificado"}</Typography>
                            </Box>
                            {(user as any).provinciaResidenciaNombre && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Provincia</Typography>
                                    <Typography>{(user as any).provinciaResidenciaNombre}</Typography>
                                </Box>
                            )}
                            {(user as any).localidadResidenciaNombre && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Localidad</Typography>
                                    <Typography>{(user as any).localidadResidenciaNombre}</Typography>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Stack>

            </Paper>
        </Box>
    );
}
