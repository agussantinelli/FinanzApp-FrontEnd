"use client";

import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

export interface FloatingMessageProps {
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
            sx={{
                mt: 10,
                width: '95%',
                maxWidth: '1600px',
                left: '50%',
                transform: 'translateX(-50%)'
            }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                sx={{
                    width: "100%",
                    boxShadow: 3,
                    fontSize: '1rem',
                    alignItems: 'center'
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
