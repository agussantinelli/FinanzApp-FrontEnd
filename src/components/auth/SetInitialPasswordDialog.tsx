"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Alert
} from "@mui/material";
import { setInitialPassword, setAuthSession, getCurrentUser } from "@/services/AuthService";

interface SetInitialPasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function SetInitialPasswordDialog({ open, onClose }: SetInitialPasswordDialogProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            await setInitialPassword({ newPassword });
            setSuccess(true);

            const currentUser = getCurrentUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, tieneContrasenaConfigurada: true };
                sessionStorage.setItem("fa_user", JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("fa-auth-changed"));
            }

            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al establecer la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNewPassword("");
        setConfirmPassword("");
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Establecer Contraseña</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={2}>
                        {success && <Alert severity="success">Contraseña establecida con éxito.</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}
                        <Alert severity="info">Configura una contraseña para poder ingresar con tu email y contraseña además de Google.</Alert>

                        <TextField
                            label="Nueva Contraseña"
                            type="password"
                            fullWidth
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading || success}
                        />
                        <TextField
                            label="Confirmar Contraseña"
                            type="password"
                            fullWidth
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading || success}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading || success}>Guardar</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
