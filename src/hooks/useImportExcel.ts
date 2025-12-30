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

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editingItems, setEditingItems] = useState<ImportedItemPreviewDTO[]>([]);

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
        setIsEditing(false);
        setEditingItems([]);
    };

    const retry = () => {
        setStep("UPLOAD");
        setErrorMessage(null);
        setIsEditing(false);
    };

    // Editing Functions
    const startEdit = () => {
        if (previewData) {
            setEditingItems([...previewData.items]); // Deep copy if needed, but shallow copy of array is usually enough for 1st level
            setIsEditing(true);
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingItems([]);
    };

    const updateEditingItem = (index: number, field: keyof ImportedItemPreviewDTO, value: any) => {
        const newItems = [...editingItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setEditingItems(newItems);
    };

    const saveEdit = () => {
        if (!previewData) return;

        // Apply changes and potentially re-validate locally
        const updatedItems = editingItems.map(item => {
            // Basic Local Validation
            let isValid = true;
            let validationMessage = null;

            // Force Uppercase Symbol
            const symbol = item.symbol ? item.symbol.toUpperCase() : "";

            if (!symbol) {
                isValid = false;
                validationMessage = "Falta el símbolo (Ticker)";
            } else if (item.cantidad <= 0) {
                isValid = false;
                validationMessage = "La cantidad debe ser mayor a 0";
            } else if (item.precioUnitario < 0) {
                isValid = false;
                validationMessage = "El precio no puede ser negativo";
            } else if (!item.fecha || isNaN(Date.parse(item.fecha))) {
                isValid = false;
                validationMessage = "Fecha inválida";
            }

            return {
                ...item,
                symbol: symbol, // Save uppercased
                isValid,
                validationMessage
            };
        });

        setPreviewData({
            ...previewData,
            items: updatedItems
        });
        setIsEditing(false);
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
        retry,
        // Edit exports
        isEditing,
        editingItems,
        startEdit,
        cancelEdit,
        updateEditingItem,
        saveEdit
    };
}
