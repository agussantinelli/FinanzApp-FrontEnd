import { useState } from "react";
import { analyzeFile, confirmImport } from "@/services/ImportService";
import { ImportPreviewDTO, ImportedItemPreviewDTO } from "@/types/Import";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export type ImportStep = "UPLOAD" | "ANALYZING" | "PREVIEW" | "CONFIRMING" | "SUCCESS" | "ERROR";

export function useImportExcel(onSuccess?: () => void) {
    const [step, setStep] = useState<ImportStep>("UPLOAD");
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ImportPreviewDTO | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { selectedId } = usePortfolioData();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selected = event.target.files[0];
            if (!selected.name.match(/\.(xlsx|xls)$/)) {
                setErrorMessage("Solo se permiten archivos Excel (.xlsx, .xls)");
                return;
            }
            setFile(selected);
            setErrorMessage(null);
        }
    };

    const analyze = async () => {
        if (!file) return;
        setStep("ANALYZING");
        setErrorMessage(null);

        try {
            const result = await analyzeFile(file);
            setPreviewData(result);
            setStep("PREVIEW");
        } catch (error: any) {
            console.error("Error analyzing file", error);
            setErrorMessage(error.response?.data?.message || error.message || "Error al analizar el archivo.");
            setStep("ERROR");
        }
    };

    const confirm = async () => {
        if (!previewData || !selectedId) {
            setErrorMessage("No hay datos para importar o no se seleccionó un portafolio.");
            return;
        }

        setStep("CONFIRMING");
        try {
            const validItems = previewData.items.filter((i: ImportedItemPreviewDTO) => i.isValid);

            await confirmImport({
                portafolioId: selectedId,
                items: validItems
            });
            setStep("SUCCESS");
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error("Error confirming import", error);
            setErrorMessage(error.response?.data?.error || "Error al confirmar la importación.");
            setStep("ERROR");
        }
    };

    const reset = () => {
        setStep("UPLOAD");
        setFile(null);
        setPreviewData(null);
        setErrorMessage(null);
    };

    const retry = () => {
        setStep("UPLOAD");
        setErrorMessage(null);
    };

    return {
        step,
        file,
        previewData,
        errorMessage,
        handleFileChange,
        analyze,
        confirm,
        reset,
        setStep,
        retry
    };
}
