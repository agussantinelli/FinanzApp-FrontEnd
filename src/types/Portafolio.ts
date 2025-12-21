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
    activos: ActivoEnPortafolioDTO[];
}
