"use client";

import { useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function GoogleCallbackPage() {
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const idToken = params.get("id_token");
        const error = params.get("error");

        if (window.opener) {
            if (idToken) {
                window.opener.postMessage({ type: "GOOGLE_LOGIN_SUCCESS", idToken }, window.location.origin);
            } else if (error) {
                window.opener.postMessage({ type: "GOOGLE_LOGIN_ERROR", error }, window.location.origin);
            } else {
                window.opener.postMessage({ type: "GOOGLE_LOGIN_ERROR", error: "No token received" }, window.location.origin);
            }
            window.close();
        } else {
            window.location.href = "/auth/login";
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
            <CircularProgress />
            <Typography>Procesando autenticación con Google...</Typography>
        </Box>
    );
}
