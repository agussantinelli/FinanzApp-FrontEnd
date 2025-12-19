"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RolUsuario } from "@/types/Usuario";
import { hasRole } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles?: RolUsuario[]; // Si es undefined o vacío, solo requiere estar logueado
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    allowedRoles = [],
}) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/auth/login");
            return;
        }

        if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
            router.replace("/access-denied");
        }
    }, [user, loading, allowedRoles, router]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    height: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) return null;
    if (allowedRoles.length > 0 && !hasRole(allowedRoles)) return null;

    return <>{children}</>;
};
