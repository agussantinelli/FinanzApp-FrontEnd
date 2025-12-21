export interface PortafolioDTO {
    id: string; // Guid
    nombre: string;
    descripcion: string;
}

export interface ActivoEnPortafolioDTO {
    activoId: string; // Guid
    symbol: string;
    cantidad: number;
    precioPromedioCompra: number;
    precioActual: number;
    valorizadoPesos: number;
    porcentajeCartera: number;
}

export interface PortafolioValuadoDTO {
    id: string; // Guid
    nombre: string;
    descripcion: string;
    totalPesos: number;
    gananciaPesos: number;
    variacionPorcentajePesos: number;
    totalDolares: number;
    gananciaDolares: number;
    variacionPorcentajeDolares: number;
    activos: ActivoEnPortafolioDTO[];
}
