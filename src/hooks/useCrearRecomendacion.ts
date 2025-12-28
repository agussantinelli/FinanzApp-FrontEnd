import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSectores } from "@/services/SectorService";
import { createRecomendacion } from "@/services/RecomendacionesService";
import { SectorDTO } from "@/types/Sector";
import { ActivoDTO } from "@/types/Activo";
import { Riesgo, Horizonte, AccionRecomendada, CrearRecomendacionDTO } from "@/types/Recomendacion";
import { useAuth } from "@/hooks/useAuth";

export interface AssetRow {
    tempId: number;
    activo: ActivoDTO | null;
    precioAlRecomendar: string;
    precioObjetivo: string;
    stopLoss: string;
    accion: AccionRecomendada | "";
}

export const useCrearRecomendacion = () => {
    const router = useRouter();
    const { user } = useAuth();

    // Form States
    const [titulo, setTitulo] = useState("");
    const [justificacion, setJustificacion] = useState("");
    const [fuente, setFuente] = useState("");
    const [riesgo, setRiesgo] = useState<Riesgo | "">("");
    const [horizonte, setHorizonte] = useState<Horizonte | "">("");
    const [selectedSectores, setSelectedSectores] = useState<SectorDTO[]>([]);

    const [availableSectores, setAvailableSectores] = useState<SectorDTO[]>([]);
    const [assetRows, setAssetRows] = useState<AssetRow[]>([]);

    // UI States
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        getSectores().then(setAvailableSectores).catch(console.error);
        setAssetRows([{ tempId: Date.now(), activo: null, precioAlRecomendar: "", precioObjetivo: "", stopLoss: "", accion: "" }]);
    }, []);

    const handleAddRow = () => {
        setAssetRows(prev => [...prev, { tempId: Date.now(), activo: null, precioAlRecomendar: "", precioObjetivo: "", stopLoss: "", accion: "" }]);
    };

    const handleRemoveRow = (tempId: number) => {
        setAssetRows(prev => prev.filter(r => r.tempId !== tempId));
    };

    const updateRow = (tempId: number, field: keyof AssetRow, value: any) => {
        setAssetRows(prev => prev.map(r => {
            if (r.tempId !== tempId) return r;

            const updated = { ...r, [field]: value };

            // Auto-fill price if active changes
            if (field === 'activo') {
                const activo = value as ActivoDTO | null;
                if (activo && activo.precioActual !== undefined && activo.precioActual !== null) {
                    updated.precioAlRecomendar = activo.precioActual.toString();
                } else if (activo === null) {
                    updated.precioAlRecomendar = "";
                }
            }

            return updated;
        }));
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!titulo.trim()) newErrors.titulo = "El título es requerido";
        if (!justificacion.trim()) newErrors.justificacion = "La justificación es requerida";
        if (!riesgo) newErrors.riesgo = "El riesgo es requerido";
        if (!horizonte) newErrors.horizonte = "El horizonte es requerido";
        if (selectedSectores.length === 0) newErrors.sectores = "Selecciona al menos un sector";

        if (assetRows.length === 0) {
            newErrors.assets = "Debe haber al menos un activo recomendado";
        } else {
            assetRows.forEach((row, index) => {
                if (!row.activo) newErrors[`asset_${index}_activ`] = "Selecciona un activo";
                if (!row.precioAlRecomendar) newErrors[`asset_${index}_pAR`] = "Requerido";
                if (!row.precioObjetivo) newErrors[`asset_${index}_pO`] = "Requerido";
                if (!row.stopLoss) newErrors[`asset_${index}_sL`] = "Requerido";
                if (!row.accion) newErrors[`asset_${index}_acc`] = "Requerido";
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        setApiError(null);
        setAiError(null);
        setSuccess(null);

        try {
            const dto: CrearRecomendacionDTO = {
                titulo,
                justificacionLogica: justificacion,
                fuente,
                riesgo: Number(riesgo),
                horizonte: Number(horizonte),
                personaId: user?.id || "",
                sectoresIds: selectedSectores.map(s => s.id),
                detalles: assetRows.map(r => ({
                    activoId: r.activo!.id,
                    precioAlRecomendar: Number(r.precioAlRecomendar),
                    precioObjetivo: Number(r.precioObjetivo),
                    stopLoss: Number(r.stopLoss),
                    accion: Number(r.accion),
                }))
            };

            await createRecomendacion(dto);
            setSuccess("Recomendación publicada con éxito.");
            setTimeout(() => {
                router.push("/recomendaciones");
            }, 1000);
        } catch (error: any) {
            console.error(error);
            const data = error.response?.data;
            const msg = data?.mensaje || data?.message || "Error al crear la recomendación.";

            // AI Validation Error Handling
            if (error.response?.status === 400 && data?.error === "Validación IA Fallida") {
                setAiError(msg);
            } else {
                setApiError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        // States
        titulo, setTitulo,
        justificacion, setJustificacion,
        fuente, setFuente,
        riesgo, setRiesgo,
        horizonte, setHorizonte,
        selectedSectores, setSelectedSectores,
        availableSectores,
        assetRows,
        loading,
        errors,
        apiError, aiError, success,

        // Handlers
        handleAddRow,
        handleRemoveRow,
        updateRow,
        handleSubmit,
        clearApiError: () => setApiError(null),
        clearAiError: () => setAiError(null),
        clearSuccess: () => setSuccess(null),
    };
};
