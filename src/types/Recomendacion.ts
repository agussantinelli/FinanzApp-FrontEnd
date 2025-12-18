export enum Riesgo {
    Conservador = 1,
    Moderado = 2,
    Agresivo = 3,
    Especulativo = 4
}

export enum Horizonte {
    Corto = 1, // < 6 meses
    Mediano = 2, // 6-18 meses
    Largo = 3 // > 18 meses
}

export enum AccionRecomendada {
    Comprar = 1,
    CompraFuerte = 2,
    Mantener = 3,
    Vender = 4
}

export interface RecomendacionDetalleDTO {
    nroRecomendacionDetalle?: number;
    activoId: string;
    activo?: {
        symbol: string;
        nombre: string;
    };
    precioAlRecomendar: number;
    precioObjetivo: number;
    stopLoss: number;
    accion: AccionRecomendada;
}

export interface RecomendacionDTO {
    id: string; // uuid
    titulo: string;
    justificacionLogica: string;
    fuente: string;
    fechaInforme: string; // date-time string
    riesgo: Riesgo;
    horizonte: Horizonte;
    estado: boolean;
    persona: {
        id: string;
        nombre: string;
        apellido: string;
    };
    sectoresObjetivo: {
        id: string;
        nombre: string;
    }[];
    detalles: RecomendacionDetalleDTO[];
}

export interface CrearRecomendacionDTO {
    titulo: string;
    justificacionLogica: string;
    fuente: string;
    riesgo: Riesgo;
    horizonte: Horizonte;
    sectoresObjetivo: { id: string }[];
    detalles: {
        activoId: string;
        precioAlRecomendar: number;
        precioObjetivo: number;
        stopLoss: number;
        accion: AccionRecomendada;
    }[];
}
