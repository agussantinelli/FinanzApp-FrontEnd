export interface OperacionDetalleDTO {
    id: string; // Guid
    fecha: string; // DateTime
    tipo: string; // "Compra" | "Venta"
    activoSymbol: string;
    activoNombre: string;
    sectorNombre: string;
    cantidad: number;
    precioUnitario: number;
    totalOperado: number;
    moneda: string;
    personaNombre: string;
    personaApellido: string;
    personaRol: string;
}
