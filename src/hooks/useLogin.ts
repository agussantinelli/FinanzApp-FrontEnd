import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getHomePathForRole } from "@/services/AuthService";

export type LoginErrors = {
    email?: string;
    password?: string;
};

export function useLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

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
            const resp = await login({ email, password });
            const destino = getHomePathForRole(resp.rol);

            setSuccessMessage("Inicio de sesión correcto. Redirigiendo…");

            setTimeout(() => {
                router.push(destino);
            }, 800);
        } catch (err) {
            console.error("Error login:", err);
            setServerError("Email o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

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
        clearFieldError
    };
}
