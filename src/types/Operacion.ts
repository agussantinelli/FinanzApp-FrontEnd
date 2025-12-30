export enum TipoOperacion {
    Compra = 0,
    Venta = 1
}

export interface CreateOperacionDTO {
    personaId: string;
    activoId: string;
    portafolioId: string;
    tipo: TipoOperacion;
    cantidad: number;
    precioUnitario: number;
    monedaOperacion: string;
    comision?: number;
    fechaOperacion?: string;
}

export interface OperacionResponseDTO {
    id: string;
    activoSymbol: string;
    activoNombre: string;
    activoTipo: string;
    tipo: string;
    cantidad: number;
    precioUnitario: number;
    totalOperado: number;
    moneda: string;
    fecha: string;
    personaNombre: string;
    personaApellido?: string;
    personaEmail?: string;
    activoId?: string;
}

export interface OperacionQueryFilter {
    activoId?: string;
    sectorId?: string;
    personaId?: string;
    rol?: number;
    soloHoy?: boolean;
}

export interface OperacionDetalleDTO {
    id: string;
    tipo: string;
    cantidad: number;
    precioUnitario: number;
    moneda: string;
    fecha: string;

    activoNombre: string;
    activoSymbol: string;
    sectorNombre: string;
    usuarioNombre: string;
    usuarioRol: string;
    portafolioNombre: string;
}

export interface UpdateOperacionDTO {
    cantidad: number;
    precioUnitario: number;
    fechaOperacion?: string;
    comision?: number;
}
