export interface CreateOperacionDTO {
    personaId: number;
    activoId: number;
    tipo: string; // Enum: Compra, Venta, etc.
    cantidad: number;
    precioUnitario: number;
    monedaOperacion: string;
    comision?: number;
    fechaOperacion?: string;
}

export interface OperacionResponseDTO {
    id: number;
    activoSymbol: string;
    activoNombre: string;
    tipo: string;
    cantidad: number;
    precioUnitario: number;
    totalOperado: number;
    moneda: string;
    fecha: string;
    personaNombre: string;
}
