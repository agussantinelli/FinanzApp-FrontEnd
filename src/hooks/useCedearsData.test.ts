import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCedearsData } from './useCedearsData';
import { getCedearDuals } from '@/services/CedearsService';
import { getCotizacionesDolar } from '@/services/DolarService';

vi.mock('@/services/CedearsService', () => ({
    getCedearDuals: vi.fn(),
}));

vi.mock('@/services/DolarService', () => ({
    getCotizacionesDolar: vi.fn(),
}));

describe('useCedearsData hook', () => {
    const mockCedears = [
        { localSymbol: 'AAPL.BA', usedDollarRate: 1000 },
        { localSymbol: 'OTHER.BA', usedDollarRate: 1000 },
    ];
    const mockDolar = [{ nombre: 'Dólar Contado con Liqui', venta: 1100 }];

    beforeEach(() => {
        vi.clearAllMocks();
        (getCedearDuals as any).mockResolvedValue(mockCedears);
        (getCotizacionesDolar as any).mockResolvedValue(mockDolar);
    });

    it('should load cedears and CCL rate on mount', async () => {
        const { result } = renderHook(() => useCedearsData());

        await act(async () => { /* wait */ });

        expect(getCedearDuals).toHaveBeenCalled();
        expect(result.current.withDerived[0].usedDollarRate).toBe(1100); // Updated from CCL
    });

    it('should filter only wanted symbols', async () => {
        const { result } = renderHook(() => useCedearsData());

        await act(async () => { /* wait */ });

        expect(result.current.withDerived).toHaveLength(1);
        expect(result.current.withDerived[0].localSymbol).toBe('AAPL.BA');
    });

    it('should setup interval for refresh', async () => {
        vi.useFakeTimers();
        const spy = vi.fn();
        (getCedearDuals as any).mockImplementation(spy);

        renderHook(() => useCedearsData());

        act(() => {
            vi.advanceTimersByTime(300_000);
        });

        expect(spy).toHaveBeenCalled();
        vi.useRealTimers();
    });
});
