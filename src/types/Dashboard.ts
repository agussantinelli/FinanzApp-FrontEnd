export interface InversorStatsDTO {
    valorTotal: number;
    rendimientoDiario: number;
    cantidadActivos: number;
    exposicionCripto: number;
}

export interface ExpertoStatsDTO {
    totalRecomendaciones: number;
    recomendacionesActivas: number;
    ranking: number;
}

export interface AdminStatsDTO {
    totalUsuarios: number;
    nuevosUsuariosMes: number;
    totalActivos: number;
    recomendacionesPendientes: number;
}

export interface AdminPortfolioStatsDTO {
    totalCapitalPesos: number;
    totalCapitalDolares: number;
    activosMasPopulares: { activoSymbol: string; cantidadUsuarios: number }[];
    distribucionPorSector: { sectorNombre: string; porcentaje: number }[];
}
