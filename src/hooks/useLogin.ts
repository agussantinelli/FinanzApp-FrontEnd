import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, googleLogin, getHomePathForRole } from "@/services/AuthService";

export type LoginErrors = {
    email?: string;
    password?: string;
};

export function useLogin() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const validate = (): boolean => {
        const errors: LoginErrors = {};
        const emailTrim = email.trim();

        if (!emailTrim) {
            errors.email = "El email es obligatorio.";
        } else if (!/^\S+@\S+\.\S+$/.test(emailTrim)) {
            errors.email = "El email no tiene un formato válido.";
        }

        if (!password) {
            errors.password = "La contraseña es obligatoria.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        setSuccessMessage(null);

        if (!validate()) return;

        try {
            setLoading(true);
            const resp = await login({ email: email.trim(), password });
            const destino = getHomePathForRole(resp.rol);

            setSuccessMessage("Inicio de sesión correcto. Redirigiendo…");

            setTimeout(() => {
                router.push(destino);
            }, 800);
        } catch (err) {
            console.error("Error login:", err);
            setServerError("Email o contraseña incorrectos.");
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            setServerError("Falta configuración de Google Client ID.");
            return;
        }

        const redirectUri = `${window.location.origin}/auth/google-callback`;
        const scope = "openid email profile";
        const nonce = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=${encodeURIComponent(scope)}&nonce=${nonce}&prompt=select_account`;

        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
            authUrl,
            "GoogleLogin",
            `width=${width},height=${height},left=${left},top=${top}`
        );
    };


    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === "GOOGLE_LOGIN_SUCCESS" && event.data.idToken) {
                try {
                    setLoading(true);
                    const resp = await googleLogin(event.data.idToken);
                    const destino = getHomePathForRole(resp.rol);
                    setSuccessMessage("Inicio de sesión con Google correcto. Redirigiendo…");
                    setTimeout(() => router.push(destino), 800);
                } catch (err: any) {
                    console.error("Google Login Error (Backend):", err);
                    setServerError(err.response?.data?.message || "Error al autenticar con Google.");
                    setLoading(false);
                }
            } else if (event.data.type === "GOOGLE_LOGIN_ERROR") {
                setServerError("No se pudo iniciar sesión con Google.");
                console.error("Google Popup Error:", event.data.error);
                setLoading(false);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [router]);

    const clearFieldError = (field: keyof LoginErrors) => {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        loading,
        fieldErrors,
        serverError, setServerError,
        successMessage, setSuccessMessage,
        handleSubmit,
        handleGoogleLogin,
        clearFieldError
    };
}
