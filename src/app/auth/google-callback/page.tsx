"use client";

import { useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function GoogleCallbackPage() {
    useEffect(() => {
        // Extract params from hash (Implicit Flow returns parameters in the URL hash)
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const idToken = params.get("id_token");
        const error = params.get("error");

        if (window.opener) {
            if (idToken) {
                // Send success message to opener
                window.opener.postMessage({ type: "GOOGLE_LOGIN_SUCCESS", idToken }, window.location.origin);
            } else if (error) {
                // Send error message to opener
                window.opener.postMessage({ type: "GOOGLE_LOGIN_ERROR", error }, window.location.origin);
            } else {
                // Fallback if no token/error in hash (maybe just closed or unexpected redirect)
                window.opener.postMessage({ type: "GOOGLE_LOGIN_ERROR", error: "No token received" }, window.location.origin);
            }
            window.close();
        } else {
            // If explicit window.opener is missing (e.g. user opened link directly), just redirect to login
            console.error("No opener found");
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
