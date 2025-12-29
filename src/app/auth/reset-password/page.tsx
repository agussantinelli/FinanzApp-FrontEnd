"use client";

import React, { useState, Suspense } from "react";
import { Box, Paper, Typography, TextField, Button, Stack, CircularProgress } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordConfirm } from "@/services/AuthService";
import FloatingMessage from "@/components/ui/FloatingMessage";
import styles from "../login/styles/Login.module.css";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (!token || !email) {
            setError("Token o email inválido");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await resetPasswordConfirm({ email, token, newPassword: password });
            setSuccess("Contraseña restablecida correctamente. Redirigiendo...");
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al restablecer contraseña.");
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <Box className={styles.container}>
                <Paper elevation={6} className={styles.card}>
                    <Typography color="error">Enlace de restablecimiento inválido.</Typography>
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
                            Nueva Contraseña
                        </Typography>
                        <Typography variant="body2" className={styles.subtitle}>
                            Ingresá tu nueva contraseña.
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <div className={styles.inputStack}>
                            <TextField
                                label="Nueva Contraseña"
                                type="password"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <TextField
                                label="Confirmar Contraseña"
                                type="password"
                                fullWidth
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading || !password}
                                className={styles.submitButton}
                            >
                                {loading ? "Restableciendo..." : "Guardar Nueva Contraseña"}
                            </Button>
                        </div>
                    </Box>

                    <FloatingMessage
                        open={!!error}
                        message={error}
                        severity="error"
                        onClose={() => setError(null)}
                    />
                    <FloatingMessage
                        open={!!success}
                        message={success}
                        severity="success"
                        onClose={() => { }}
                    />
                </Stack>
            </Paper>
        </Box>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<Box display="flex" justifyContent="center" height="100vh" alignItems="center"><CircularProgress /></Box>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
