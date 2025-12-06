export interface ActivoDTO {
    id: string; // UUID
    symbol: string;
    nombre: string;
    tipo: string;
    sector: string | null; // Nuevo campo v2.0
    moneda: string;
    esLocal: boolean;
    descripcion: string;
    precioActual?: number | null;
    variacion24h?: number | null;
    ultimaActualizacion?: string | null;
}
