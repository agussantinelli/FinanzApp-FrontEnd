"use client";

import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface FloatingMessageProps {
    open: boolean;
    message: string | null;
    severity: AlertColor;
    onClose: () => void;
}

export default function FloatingMessage({ open, message, severity, onClose }: FloatingMessageProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ mt: 10 }} // Pushes below navbar
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%", boxShadow: 3 }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
