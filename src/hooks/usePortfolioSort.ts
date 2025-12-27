import { useState, useMemo } from 'react';
import { ActivoEnPortafolioDTO } from '@/types/Portafolio';

export type Order = 'asc' | 'desc';
export type OrderBy = 'symbol' | 'moneda' | 'cantidad' | 'ppc' | 'totalCost' | 'price' | 'currentValue' | 'percentage' | 'performance';

interface UsePortfolioSortProps {
    activos: ActivoEnPortafolioDTO[] | undefined;
    currency: 'ARS' | 'USD';
    totalPesos?: number | null;
    totalDolares?: number | null;
}

export function usePortfolioSort({ activos, currency, totalPesos, totalDolares }: UsePortfolioSortProps) {
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<OrderBy>('currentValue');

    const handleRequestSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedActivos = useMemo(() => {
        if (!activos) return [];

        const ccl = (totalDolares && totalPesos)
            ? totalPesos / totalDolares
            : 0;

        return [...activos].sort((a, b) => {
            let valA: number | string = 0;
            let valB: number | string = 0;

            // Helper to get normalized prices for sorting
            const getValues = (asset: ActivoEnPortafolioDTO) => {
                const assetCurrency = asset.moneda || "ARS";
                const isAssetUSD = assetCurrency === 'USD' || assetCurrency === 'USDT' || assetCurrency === 'USDC';

                let price = 0;
                let ppc = 0;

                if (currency === 'ARS') {
                    price = isAssetUSD ? (ccl > 0 ? asset.precioActual * ccl : 0) : asset.precioActual;
                    ppc = isAssetUSD ? (ccl > 0 ? asset.precioPromedioCompra * ccl : 0) : asset.precioPromedioCompra;
                } else {
                    price = !isAssetUSD ? (ccl > 0 ? asset.precioActual / ccl : 0) : asset.precioActual;
                    ppc = !isAssetUSD ? (ccl > 0 ? asset.precioPromedioCompra / ccl : 0) : asset.precioPromedioCompra;
                }
                return { price, ppc };
            };

            const { price: priceA, ppc: ppcA } = getValues(a);
            const { price: priceB, ppc: ppcB } = getValues(b);

            switch (orderBy) {
                case 'symbol':
                    valA = a.symbol;
                    valB = b.symbol;
                    break;
                case 'moneda':
                    valA = a.moneda;
                    valB = b.moneda;
                    break;
                case 'cantidad':
                    valA = a.cantidad;
                    valB = b.cantidad;
                    break;
                case 'ppc':
                    valA = ppcA;
                    valB = ppcB;
                    break;
                case 'totalCost':
                    valA = ppcA * a.cantidad;
                    valB = ppcB * b.cantidad;
                    break;
                case 'price':
                    valA = priceA;
                    valB = priceB;
                    break;
                case 'currentValue':
                    valA = priceA * a.cantidad;
                    valB = priceB * b.cantidad;
                    break;
                case 'percentage':
                    valA = a.porcentajeCartera;
                    valB = b.porcentajeCartera;
                    break;
                case 'performance':
                    valA = a.precioPromedioCompra > 0 ? ((a.precioActual - a.precioPromedioCompra) / a.precioPromedioCompra) : -999;
                    valB = b.precioPromedioCompra > 0 ? ((b.precioActual - b.precioPromedioCompra) / b.precioPromedioCompra) : -999;
                    break;
            }

            if (valB < valA) {
                return order === 'desc' ? -1 : 1;
            }
            if (valB > valA) {
                return order === 'desc' ? 1 : -1;
            }
            return 0;
        });
    }, [activos, order, orderBy, currency, totalPesos, totalDolares]);

    return {
        order,
        orderBy,
        handleRequestSort,
        sortedActivos
    };
}
