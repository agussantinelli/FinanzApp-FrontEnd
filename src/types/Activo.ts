
export interface ContraparteDto {
    id: string;
    symbol: string;
    nombre: string;
    tipoRelacion: string; // "CEDEAR" | "Subyacente"
    ratio: number;
}

export interface ActivoDTO {
    id: string; // Guid
    symbol: string;
    nombre: string;
    tipo: string;
    tipoActivoId: number;
    monedaBase: string; // "USD" | "ARS"
    sector: string;
    sectorId?: string | null;

    esLocal: boolean;
    descripcion: string;

    // --- PRECIOS Y MERCADO ---
    precioActual?: number | null;
    precioUSD?: number | null;
    precioARS?: number | null;
    variacion24h?: number | null;
    marketCap?: number | null;
    ultimaActualizacion?: string | null; // DateTime ISO

    // --- RELACIÓN CEDEAR <-> USA ---
    contraparte?: ContraparteDto | null;

    // --- ESTADO SOCIAL ---
    loSigo: boolean;

    // --- LEGACY / FRONTEND SPECIFIC ---
    precioCompra?: number | null;
    precioVenta?: number | null;
}

export interface ActivoCreateDTO {
    symbol: string;
    nombre: string;
    tipoActivoId: number;
    sectorId?: string | null;
    monedaBase: string; // "USD" | "ARS"
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
