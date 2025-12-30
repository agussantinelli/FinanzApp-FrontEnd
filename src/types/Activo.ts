export interface ActivoDTO {
    id: string;
    symbol: string;
    nombre: string;
    tipo: string;
    tipoActivoId: number;
    monedaBase: string;
    sector: string;
    sectorId?: string | null;

    esLocal: boolean;
    descripcion: string;


    precioActual?: number | null;
    precioUSD?: number | null;
    precioARS?: number | null;
    variacion24h?: number | null;
    marketCap?: number | null;
    ultimaActualizacion?: string | null;


    contraparteId?: string | null;
    contraparteSymbol?: string | null;
    contraparteNombre?: string | null;
    tipoRelacion?: string | null;
    ratioCedear?: number | null;


    loSigo: boolean;


    precioCompra?: number | null;
    precioVenta?: number | null;
}

export interface ActivoCreateDTO {
    symbol: string;
    nombre: string;
    tipoActivoId: number;
    sectorId?: string | null;
    monedaBase: string;
    esLocal: boolean;
    descripcion: string;
}

export interface ActivoUpdateDTO {
    nombre: string;
    tipoActivoId: number;
    sectorId?: string | null;
    monedaBase: string;
    esLocal: boolean;
    descripcion: string;
}
