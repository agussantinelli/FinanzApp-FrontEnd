export interface ActivoDTO {
    id: number;
    symbol: string;
    nombre: string;
    tipo: string;
    moneda: string;
    esLocal: boolean;
    descripcion: string;
    precioActual?: number | null;
    variacion24h?: number | null;
    ultimaActualizacion?: string | null;
}
