export interface ActivoDTO {
    id: string; // Guid
    symbol: string;
    nombre: string;
    tipo: string;
    tipoActivoId: number;
    moneda: string;
    sector: string;
    sectorId?: string | null;

    esLocal: boolean;
    loSigo: boolean;
    descripcion: string;

    precioActual?: number | null;
    variacion24h?: number | null;
    marketCap?: number | null;

    ultimaActualizacion?: string | null;
}

export interface ActivoCreateDTO {
    symbol: string;
    nombre: string;
    tipoActivoId: number; // byte
    monedaBase: string; // "USD" | "ARS"
    esLocal: boolean;
    sectorId?: string | null;
    descripcion: string;
}

export interface ActivoUpdateDTO {
    symbol: string;
    nombre: string;
    tipoActivoId: number; // byte
    monedaBase: string;
    esLocal: boolean;
    sectorId?: string | null;
    descripcion: string;
}
