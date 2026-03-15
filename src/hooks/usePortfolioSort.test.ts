import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortfolioSort } from './usePortfolioSort';

describe('usePortfolioSort hook', () => {
    const mockActivos = [
        { symbol: 'AAPL', precioActual: 150, precioPromedioCompra: 100, cantidad: 10, moneda: 'USD' },
        { symbol: 'GGAL', precioActual: 1000, precioPromedioCompra: 800, cantidad: 5, moneda: 'ARS' },
    ];

    it('should sort assets by currentValue by default (desc)', () => {
        const { result } = renderHook(() => usePortfolioSort({
            activos: mockActivos as any,
            currency: 'ARS',
            totalPesos: 1000000,
            totalDolares: 1000
        }));

        // Valuation in ARS: 
        // AAPL: 150 * (1000000/1000) * 10 = 1,500,000
        // GGAL: 1000 * 5 = 5,000
        expect(result.current.sortedActivos[0].symbol).toBe('AAPL');
    });

    it('should resort when requested', () => {
        const { result } = renderHook(() => usePortfolioSort({
            activos: mockActivos as any,
            currency: 'ARS',
            totalPesos: 1000000,
            totalDolares: 1000
        }));

        act(() => {
            result.current.handleRequestSort('symbol'); // desc -> AAPL (A) < GGAL (G) -> GGAL first
        });

        expect(result.current.sortedActivos[0].symbol).toBe('GGAL');
    });
});
