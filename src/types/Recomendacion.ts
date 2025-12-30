export enum Riesgo {
    Conservador = 1,
    Moderado = 2,
    Agresivo = 3,
    Especulativo = 4
}

export enum Horizonte {
    Intradia = 1,
    Corto = 2,
    Mediano = 3,
    Largo = 4
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
    Eliminada = 3,
    Cerrada = 4
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
    id: string;
    titulo: string;
    justificacionLogica: string;
    fuente: string;
    fechaInforme: string;
    riesgo: Riesgo;
    horizonte: Horizonte;
    estado: number;
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
    riesgo: string;
    horizonte: string;
    autorId: string;
    autorNombre: string;
    fotoPerfil?: string;
    cantidadActivos: number;
    estado: number;
    esDestacada: boolean;
    esAcertada?: boolean;
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
        precioObjetivo?: number;
        stopLoss?: number;
        accion: AccionRecomendada;
    }[];
}
