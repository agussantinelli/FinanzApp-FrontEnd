export interface PortafolioDTO {
    id: string; // Guid
    nombre: string;
    descripcion?: string;
    esDestacado: boolean;
    esPrincipal: boolean;
    esTop: boolean;

    totalValuadoUSD: number;
    totalValuadoARS: number;
    totalInvertidoUSD: number;
    totalInvertidoARS: number;

    gananciaDolares?: number;
    variacionPorcentajeDolares?: number;
    gananciaPesos?: number;
    variacionPorcentajePesos?: number;

    nombreUsuario: string;
    rolUsuario: string;
    fotoPerfil?: string;
    personaId?: string; // Owner ID
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
