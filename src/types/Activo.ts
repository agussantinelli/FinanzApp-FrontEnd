export interface ActivoDTO {
    id: string; // Guid
    symbol: string;
    nombre: string;
    tipo: string;
    moneda: string;
    sector: string;

    esLocal: boolean;
    descripcion: string;

    precioActual?: number | null;
    variacion24h?: number | null;
    marketCap?: number | null;

    ultimaActualizacion?: string | null;
}

export interface ActivoCreateDTO {
    symbol: string;
    nombre: string;
    tipo: number; // byte
    monedaBase: string;
    esLocal: boolean;
}
