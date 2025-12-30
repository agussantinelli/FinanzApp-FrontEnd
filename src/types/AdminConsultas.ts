export interface OperacionDetalleDTO {
    id: string;
    fecha: string;
    tipo: string;
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
