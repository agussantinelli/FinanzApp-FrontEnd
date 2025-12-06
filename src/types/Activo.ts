export interface ActivoDTO {
    id: string; // UUID
    symbol: string;
    nombre: string;
    tipo: string;
    sector: string | null;
    moneda: string;
    esLocal: boolean;
    descripcion: string;
    precioActual?: number | null;
    variacion24h?: number | null;
    marketCap?: number | null;
    ultimaActualizacion?: string | null;
}
