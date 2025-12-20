// Enum mappings for UI helpers
export enum Riesgo {
    Conservador = 1,
    Moderado = 2,
    Agresivo = 3,
    Especulativo = 4
}

export enum Horizonte {
    Intradia = 1, // < 1 día
    Corto = 2, // < 6 meses
    Mediano = 3, // 6-18 meses
    Largo = 4 // > 18 meses
}

export enum AccionRecomendada {
    Comprar = 1,
    CompraFuerte = 2,
    Mantener = 3,
    Vender = 4
}

export enum EstadoRecomendacion {
    Pendiente = 0,
    Aceptada = 1,
    Rechazada = 2,
    Eliminada = 3
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
    estado: number; // Enum: EstadoRecomendacion
    persona?: {
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

export interface RecomendacionResumenDTO {
    id: string;
    titulo: string;
    fuente: string;
    fecha: string; // DateTime
    riesgo: string; // String from backend
    horizonte: string; // String from backend
    autorId: string; // Added to keys for filtering
    autorNombre: string;
    cantidadActivos: number;
    estado: number; // Enum
}

export interface CrearRecomendacionDTO {
    titulo: string;
    justificacionLogica: string;
    fuente: string;
    riesgo: Riesgo;
    horizonte: Horizonte;
    personaId: string;
    sectoresIds: string[];
    detalles: {
        activoId: string;
        precioAlRecomendar: number;
        precioObjetivo: number;
        stopLoss: number;
        accion: AccionRecomendada;
    }[];
}
