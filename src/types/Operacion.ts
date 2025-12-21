export enum TipoOperacion {
    Compra = 0,
    Venta = 1
}

export interface CreateOperacionDTO {
    personaId: string; // Guid
    activoId: string; // Guid
    portafolioId: string; // Guid
    tipo: TipoOperacion;
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

export interface OperacionQueryFilter {
    activoId?: string;
    sectorId?: string;
    personaId?: string;
    // rol?: RolUsuario; // Avoid circular dependency if possible, or use number
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
