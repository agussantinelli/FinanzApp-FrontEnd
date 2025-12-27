export interface PortafolioDTO {
    id: string; // Guid
    nombre: string;
    descripcion?: string;
    esDestacado: boolean;
    esPrincipal: boolean;

    // --- CAMPOS ADMINISTRATIVOS Y FINANCIEROS (Dual Currency) ---
    totalValuadoUSD: number;
    totalValuadoARS: number;
    totalInvertidoUSD: number;
    totalInvertidoARS: number;

    nombreUsuario: string;
    rolUsuario: string;
}

export interface ActivoEnPortafolioDTO {
    activoId: string; // Guid
    symbol: string;
    tipoActivo: string;
    moneda: string;
    cantidad: number;
    precioPromedioCompra: number;
    precioActual: number;
    valorizadoNativo: number;
    porcentajeCartera: number;
}

export interface PortafolioValuadoDTO {
    id: string; // Guid
    nombre: string;
    descripcion?: string;
    esPrincipal: boolean;
    esDestacado: boolean;

    totalPesos: number;
    gananciaPesos: number;
    variacionPorcentajePesos: number;
    totalDolares: number;
    gananciaDolares: number;
    variacionPorcentajeDolares: number;

    loSigo: boolean;
    activos: ActivoEnPortafolioDTO[];
}

export interface PortafolioCreateDTO {
    nombre: string;
    descripcion?: string;
    esPrincipal?: boolean;
}

export interface PortafolioUpdateDTO {
    nombre: string;
    descripcion?: string;
}
