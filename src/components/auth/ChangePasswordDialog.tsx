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
import { changePassword } from "@/services/AuthService";

interface ChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
    const [currentPassword, setCurrentPassword] = useState("");
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
            setError("Las contraseñas nuevas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            await changePassword({ currentPassword, newPassword });
            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cambiar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack spacing={2}>
                        {success && <Alert severity="success">Contraseña cambiada con éxito.</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            label="Contraseña Actual"
                            type="password"
                            fullWidth
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={loading || success}
                        />
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
                            label="Confirmar Nueva Contraseña"
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
                    <Button type="submit" variant="contained" disabled={loading || success}>Cambiar</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
