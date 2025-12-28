export interface PortafolioDTO {
    id: string; // Guid
    nombre: string;
    descripcion?: string;
    esDestacado: boolean;
    esPrincipal: boolean;

    // --- NUEVO: Propiedad Top ---
    esTop: boolean;
    loSigo?: boolean;

    // --- CAMPOS ADMINISTRATIVOS Y FINANCIEROS (Dual Currency) ---
    totalValuadoUSD: number;
    totalValuadoARS: number;
    totalInvertidoUSD: number;
    totalInvertidoARS: number;

    // Optional computed fields for accuracy
    gananciaDolares?: number;
    variacionPorcentajeDolares?: number;
    gananciaPesos?: number;
    variacionPorcentajePesos?: number;

    nombreUsuario: string;
    rolUsuario: string;
    fotoPerfil?: string;
    activos?: ActivoEnPortafolioDTO[];
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
    esTop: boolean;

    totalPesos: number;
    gananciaPesos: number;
    variacionPorcentajePesos: number;
    totalDolares: number;
    gananciaDolares: number;
    variacionPorcentajeDolares: number;

    loSigo: boolean;
    activos: ActivoEnPortafolioDTO[];
    nombreAutor: string;
    rolUsuario: string;
    fotoPerfil?: string;
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
