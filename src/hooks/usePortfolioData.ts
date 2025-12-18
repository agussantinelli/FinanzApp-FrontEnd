import { useMemo } from 'react';

export type PositionRow = {
    ticker: string;
    nombre: string;
    tipo: "CEDEAR" | "Acción" | "Cripto" | "Bono";
    cantidad: number;
    precioActualArs: number;
    valorTotalArs: number;
    variacionDiaPct: number;
    variacionTotalPct: number;
};

const mockPositions: PositionRow[] = [
    {
        ticker: "AAPL",
        nombre: "Apple (CEDEAR)",
        tipo: "CEDEAR",
        cantidad: 15,
        precioActualArs: 52000,
        valorTotalArs: 780000,
        variacionDiaPct: 1.2,
        variacionTotalPct: 18.7,
    },
    {
        ticker: "GGAL",
        nombre: "Banco Galicia",
        tipo: "Acción",
        cantidad: 120,
        precioActualArs: 1250,
        valorTotalArs: 150000,
        variacionDiaPct: -0.8,
        variacionTotalPct: 5.3,
    },
    {
        ticker: "BTC",
        nombre: "Bitcoin",
        tipo: "Cripto",
        cantidad: 0.035,
        precioActualArs: 35000000,
        valorTotalArs: 1225000,
        variacionDiaPct: 2.4,
        variacionTotalPct: 32.1,
    },
    {
        ticker: "AL30",
        nombre: "Bono AL30",
        tipo: "Bono",
        cantidad: 300,
        precioActualArs: 4100,
        valorTotalArs: 1230000,
        variacionDiaPct: 0.3,
        variacionTotalPct: 9.8,
    },
];

export function usePortfolioData() {
    const totalValor = useMemo(() => mockPositions.reduce(
        (acc, p) => acc + p.valorTotalArs,
        0
    ), []);

    const totalCripto = useMemo(() => mockPositions
        .filter((p) => p.tipo === "Cripto")
        .reduce((acc, p) => acc + p.valorTotalArs, 0), []);

    const totalRiesgo = useMemo(() => mockPositions
        .filter((p) => p.tipo === "Cripto" || p.tipo === "Acción")
        .reduce((acc, p) => acc + p.valorTotalArs, 0), []);

    const exposicionCriptoPct =
        totalValor > 0 ? (totalCripto / totalValor) * 100 : 0;

    const exposicionRiesgoPct =
        totalValor > 0 ? (totalRiesgo / totalValor) * 100 : 0;

    const totalActivos = mockPositions.length;

    return {
        positions: mockPositions,
        totalValor,
        exposicionCriptoPct,
        exposicionRiesgoPct,
        totalActivos
    };
}
