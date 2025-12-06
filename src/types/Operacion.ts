export interface CreateOperacionDTO {
    personaId: string; // UUID
    activoId: string; // UUID
    tipo: number; // Enum: 0 = Compra, 1 = Venta
    cantidad: number;
    precioUnitario: number;
    monedaOperacion: string;
    comision?: number;
    fechaOperacion?: string;
}

export interface OperacionResponseDTO {
    id: string; // UUID
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
