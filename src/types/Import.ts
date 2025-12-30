export interface ImportedItemPreviewDTO {
    symbol: string;
    tipoActivoDetectado: string;
    tipoOperacion: string;
    cantidad: number;
    precioUnitario: number;
    moneda: string;
    fecha: string; // ISO DateTime

    isValid: boolean;
    validationMessage?: string | null;

    activoIdResolved?: string | null;
}

export interface ImportPreviewDTO {
    canImport: boolean;
    items: ImportedItemPreviewDTO[];
    globalErrors: string[];
}

export interface ImportConfirmDTO {
    portafolioId: string;
    items: ImportedItemPreviewDTO[];
}
