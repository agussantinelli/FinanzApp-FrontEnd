export interface ActivoDTO {
    id: number;
    symbol: string;
    nombre: string;
    tipo: string;
    moneda: string;
    esLocal: boolean;
    descripcion: string;
    precioActual?: number;
    variacion24h?: number;
    ultimaActualizacion?: string;
}
