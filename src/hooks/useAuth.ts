import { useState, useEffect, useCallback } from "react";
import { AuthenticatedUser } from "@/types/Usuario";
import { getCurrentUser, clearAuthSession } from "@/services/AuthService";
import { useRouter } from "next/navigation";

export function useAuth() {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadUser = useCallback(() => {
        const u = getCurrentUser();
        setUser(u);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUser();

        const handler = () => loadUser();

        if (typeof window !== "undefined") {
            window.addEventListener("fa-auth-changed", handler);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("fa-auth-changed", handler);
            }
        };
    }, [loadUser]);

    const logout = useCallback(() => {
        clearAuthSession();
        setUser(null);
        router.push("/auth/login");
    }, [router]);

    return {
        user,
        loading,
        logout,
        isAuthenticated: !!user,
        refreshUser: loadUser
    };
}
