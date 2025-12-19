export interface CreateOperacionDTO {
    personaId: string; // Guid
    activoId: string; // Guid
    tipo: number; // Enum: 0 = Compra, 1 = Venta
    cantidad: number;
    precioUnitario: number;
    monedaOperacion: string; // "ARS" default
    comision?: number;
    fechaOperacion?: string;
}

export interface OperacionResponseDTO {
    id: string; // Guid
    activoSymbol: string;
    activoNombre: string;
    tipo: string; // "Compra" | "Venta" string description
    cantidad: number;
    precioUnitario: number;
    totalOperado: number;
    moneda: string;
    fecha: string;
    personaNombre: string;
}
