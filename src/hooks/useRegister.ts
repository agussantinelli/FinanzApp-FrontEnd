import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    getRegisterGeoData,
    register as registerService,
    getHomePathForRole,
} from '@/services/AuthService';
import { RegisterGeoDataDTO } from '@/types/Geo';

export type RegisterFieldErrors = {
    nombre?: string;
    apellido?: string;
    email?: string;
    fechaNac?: string;
    password?: string;
    password2?: string;
    paisNacId?: string;
    paisResidenciaId?: string;
    provinciaResidenciaId?: string;
    localidadResidenciaId?: string;
};

export function useRegister() {
    const router = useRouter();

    // Form Fields
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [fechaNac, setFechaNac] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [paisNacId, setPaisNacId] = useState<string>("");
    const [paisResidenciaId, setPaisResidenciaId] = useState<string>("");
    const [provinciaResidenciaId, setProvinciaResidenciaId] = useState<string>("");
    const [localidadResidenciaId, setLocalidadResidenciaId] = useState<string>("");

    // Geo Data State
    const [geoData, setGeoData] = useState<RegisterGeoDataDTO | null>(null);
    const [loadingGeo, setLoadingGeo] = useState(true);
    const [errorGeo, setErrorGeo] = useState<string | null>(null);

    // Submission State
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [successSubmit, setSuccessSubmit] = useState<string | null>(null);

    // Load Geo Data
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoadingGeo(true);
                const data = await getRegisterGeoData();
                if (!mounted) return;
                setGeoData(data);

                const ar = data.paises.find((p) => p.codigoIso2 === "AR");
                const arId = ar ? ar.id.toString() : "";

                setPaisNacId((prev) => prev || arId);
                setPaisResidenciaId((prev) => prev || arId);
            } catch (err) {
                if (!mounted) return;
                setErrorGeo("No se pudieron cargar países/provincias/localidades.");
            } finally {
                if (mounted) setLoadingGeo(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    // Derived State
    const argentinaId = useMemo(() => {
        if (!geoData) return "";
        const ar = geoData.paises.find((p) => p.codigoIso2 === "AR");
        return ar ? ar.id.toString() : "";
    }, [geoData]);

    const esResidenciaArgentina = paisResidenciaId === argentinaId;

    const provinciasParaCombo = useMemo(() => {
        if (!geoData || !esResidenciaArgentina) return [];
        return geoData.provinciasArgentina;
    }, [geoData, esResidenciaArgentina]);

    const localidadesParaCombo = useMemo(() => {
        if (!geoData || !esResidenciaArgentina || !provinciaResidenciaId) return [];
        const provIdNum = Number(provinciaResidenciaId);
        return geoData.localidadesArgentina.filter(
            (l) => l.provinciaId === provIdNum
        );
    }, [geoData, esResidenciaArgentina, provinciaResidenciaId]);

    // Validation
    const validate = (): boolean => {
        const errors: RegisterFieldErrors = {};
        const emailTrim = email.trim();

        if (!nombre.trim()) errors.nombre = "El nombre es obligatorio.";
        if (!apellido.trim()) errors.apellido = "El apellido es obligatorio.";

        if (!emailTrim) {
            errors.email = "El email es obligatorio.";
        } else if (!/^\S+@\S+\.\S+$/.test(emailTrim)) {
            errors.email = "El email no tiene un formato válido.";
        }

        if (!fechaNac) errors.fechaNac = "La fecha de nacimiento es obligatoria.";

        if (!password) errors.password = "La contraseña es obligatoria.";
        if (!password2) errors.password2 = "Debe repetir la contraseña.";
        if (password && password2 && password !== password2) {
            errors.password2 = "Las contraseñas no coinciden.";
        }

        if (!paisNacId) errors.paisNacId = "La nacionalidad es obligatoria.";
        if (!paisResidenciaId)
            errors.paisResidenciaId = "El país de residencia es obligatorio.";

        if (esResidenciaArgentina) {
            if (!provinciaResidenciaId)
                errors.provinciaResidenciaId =
                    "La provincia de residencia es obligatoria.";
            if (!localidadResidenciaId)
                errors.localidadResidenciaId =
                    "La localidad de residencia es obligatoria.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);
        setSuccessSubmit(null);

        if (!validate()) return;

        const nacionalidadId = Number(paisNacId);
        const paisResidId = Number(paisResidenciaId);

        const payload = {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim(),
            fechaNacimiento: fechaNac,
            password,
            nacionalidadId,
            paisResidenciaId: paisResidId,
            localidadResidenciaId: esResidenciaArgentina
                ? Number(localidadResidenciaId)
                : null,
            esResidenteArgentina: esResidenciaArgentina,
        };

        try {
            setSubmitting(true);
            const resp = await registerService(payload);

            setSuccessSubmit("Cuenta creada correctamente. Redirigiendo…");

            const destino = getHomePathForRole(resp.rol);
            setTimeout(() => {
                router.push(destino);
            }, 800);
        } catch (err: any) {
            console.error("Error registro:", err);
            const msgFromApi =
                err?.response?.data ?? "No se pudo completar el registro.";
            setApiError(msgFromApi);
        } finally {
            setSubmitting(false);
        }
    };

    const clearFieldError = (field: keyof RegisterFieldErrors) => {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return {
        // State
        nombre, setNombre,
        apellido, setApellido,
        email, setEmail,
        fechaNac, setFechaNac,
        password, setPassword,
        password2, setPassword2,
        paisNacId, setPaisNacId,
        paisResidenciaId, setPaisResidenciaId,
        provinciaResidenciaId, setProvinciaResidenciaId,
        localidadResidenciaId, setLocalidadResidenciaId,

        // Geo Data
        geoData,
        loadingGeo,
        errorGeo,
        provinciasParaCombo,
        localidadesParaCombo,
        esResidenciaArgentina,

        // Status
        submitting,
        fieldErrors,
        apiError,
        successSubmit,

        // Handlers
        handleSubmit,
        clearFieldError,
        clearApiError: () => setApiError(null),
        clearSuccessSubmit: () => setSuccessSubmit(null),
    };
}
