export interface AdminStatsDTO {
    totalUsuarios: number;
    nuevosUsuariosMes: number;
    totalActivos: number;
    recomendacionesPendientes: number;
    efectividadGlobal: string;
}

export interface AssetPopularityDTO {
    symbol: string;
    nombre: string;
    cantidadInversores: number;
    valorTotalPesos: number;
}

export interface GlobalDistributionDTO {
    tipoActivo: string;
    valorPesos: number;
    porcentaje: number;
}

export interface AdminPortfolioStatsDTO {
    totalPortafolios: number;
    totalInversoresConTenencia: number;
    valorGlobalPesos: number;
    valorGlobalDolares: number;
    variacionPromedioDiaria: number;
    activosMasPopulares: AssetPopularityDTO[];
    distribucionPorTipo: GlobalDistributionDTO[];
}