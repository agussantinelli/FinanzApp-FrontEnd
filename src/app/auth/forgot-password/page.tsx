"use client";

import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Stack, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { resetPasswordRequest } from "@/services/AuthService";
import FloatingMessage from "@/components/ui/FloatingMessage";
import styles from "../login/styles/Login.module.css"; // Reuse login styles

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            await resetPasswordRequest({ email });
            setMessage("Si el correo existe, recibirás un enlace para restablecer tu contraseña.");
        } catch (err: any) {
            setError("Ocurrió un error al procesar tu solicitud. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={styles.container}>
            <Paper elevation={6} className={styles.card}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h4" className={styles.title}>
                            Recuperar Contraseña
                        </Typography>
                        <Typography variant="body2" className={styles.subtitle}>
                            Ingresá tu email y te enviaremos las instrucciones.
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <div className={styles.inputStack}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading || !email}
                                className={styles.submitButton}
                            >
                                {loading ? "Enviando..." : "Enviar Instrucciones"}
                            </Button>
                        </div>
                    </Box>

                    <FloatingMessage
                        open={!!message}
                        message={message}
                        severity="success"
                        onClose={() => setMessage(null)}
                    />
                    <FloatingMessage
                        open={!!error}
                        message={error}
                        severity="error"
                        onClose={() => setError(null)}
                    />

                    <Box className={styles.footer}>
                        <MuiLink component={Link} href="/auth/login" underline="hover">
                            Volver al inicio de sesión
                        </MuiLink>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
