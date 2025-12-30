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



    const { selectedId, valuacion } = usePortfolioData();

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

        const validItems = previewData.items.filter((i: ImportedItemPreviewDTO) => i.isValid);

        if (valuacion && valuacion.activos) {
            const changes: Record<string, number> = {};

            validItems.forEach(item => {
                const symbol = item.symbol.toUpperCase();
                if (!changes[symbol]) changes[symbol] = 0;

                if (item.tipoOperacion === "Compra") {
                    changes[symbol] += item.cantidad;
                } else if (item.tipoOperacion === "Venta") {
                    changes[symbol] -= item.cantidad;
                }
            });

            for (const [symbol, change] of Object.entries(changes)) {

                const currentAsset = valuacion.activos.find(a =>
                    a.symbol && a.symbol.toUpperCase() === symbol
                );

                const currentQty = currentAsset ? currentAsset.cantidad : 0;
                const finalQty = currentQty + change;

                if (finalQty < 0) {
                    setErrorMessage(`Importación cancelada: El activo ${symbol} quedaría con saldo negativo (${finalQty}). Verifica tus datos.`);
                    return;
                }
            }
        }

        setStep("CONFIRMING");

        const payload = {
            portafolioId: selectedId,
            items: validItems
        };
        console.log("Enviando operaciones a confirmar:", payload);

        try {
            await confirmImport(payload);
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

    const updateItem = (index: number, updatedFields: Partial<ImportedItemPreviewDTO>) => {
        if (!previewData) return;

        const currentItem = previewData.items[index];
        const newItem = { ...currentItem, ...updatedFields };

        let isValid = true;
        let validationMessage = null;

        const symbol = newItem.symbol ? newItem.symbol.toUpperCase() : "";

        if (!symbol) {
            isValid = false;
            validationMessage = "Falta el símbolo (Ticker)";
        } else if (newItem.cantidad <= 0) {
            isValid = false;
            validationMessage = "La cantidad debe ser mayor a 0";
        } else if (newItem.precioUnitario < 0) {
            isValid = false;
            validationMessage = "El precio no puede ser negativo";
        } else if (!newItem.fecha || isNaN(Date.parse(newItem.fecha))) {
            isValid = false;
            validationMessage = "Fecha inválida";
        }

        const authenticatedItem = {
            ...newItem,
            symbol,
            isValid,
            validationMessage
        };

        const newItems = [...previewData.items];
        newItems[index] = authenticatedItem;

        setPreviewData({
            ...previewData,
            items: newItems
        });
    };


    const deleteItem = (index: number) => {
        if (!previewData) return;
        const newItems = previewData.items.filter((_, i) => i !== index);
        setPreviewData({
            ...previewData,
            items: newItems
        });
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
        updateItem,
        deleteItem,
        setErrorMessage
    };
}
